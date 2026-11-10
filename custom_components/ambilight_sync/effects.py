"""Versioned, bounded effect/behavior recipes. Interpreted data; no eval or code loading."""
from __future__ import annotations
import ast
import base64
import colorsys
from io import BytesIO
import json
import math
import re
from zipfile import ZipFile, BadZipFile
from zlib import error as ZlibError

from .color import adjust_saturation
from .lab_colors import mix_lights

FORMAT='ambilight_sync.effect'
BUNDLE='ambilight_sync.effects'
MAX_IMPORTS=8
SLUG=re.compile(r'[a-z][a-z0-9_]{0,39}')
ENTITY=re.compile(r'(?:media_player|binary_sensor|input_boolean|sensor)\.[a-z0-9_]+')
LIGHT=re.compile(r'light\.[a-z0-9_]+')
BASE_NAMES={'r','g','b','brightness','time','dt','activity','mean_change','changed_zones','paused','original_r','original_g','original_b','original_brightness','x','y','z','distance'}
VISUAL={'saturation','brightness','brightness_scale','hue','mix','color'}
POLICY={'hold','rate','transition'}
FUNCS={'min':min,'max':max,'abs':abs,'sin':math.sin,'cos':math.cos,'sqrt':lambda x:math.sqrt(max(0,x)),
       'clamp':lambda x,a,b:min(b,max(a,x)), 'mix':lambda a,b,t:a+(b-a)*min(1,max(0,t)),
       'step':lambda edge,x:float(x>=edge), 'smoothstep':lambda a,b,x:(lambda t:t*t*(3-2*t))(min(1,max(0,(x-a)/(b-a))))}
ALLOWED=(ast.Expression,ast.Constant,ast.Name,ast.Load,ast.BinOp,ast.UnaryOp,ast.BoolOp,ast.Compare,ast.IfExp,ast.Call,
         ast.Add,ast.Sub,ast.Mult,ast.Div,ast.Mod,ast.USub,ast.UAdd,ast.Not,ast.And,ast.Or,ast.Eq,ast.NotEq,ast.Lt,ast.LtE,ast.Gt,ast.GtE)


def number(v,lo=-1e6,hi=1e6):
    if type(v) not in (int,float) or not lo<=v<=hi or not math.isfinite(v):raise ValueError('Invalid finite number')
    return float(v)


def text(v,limit):
    if not isinstance(v,str) or len(v)>limit:raise ValueError('Invalid text')
    return v


def expression(source,names):
    source=str(source) if type(source) in (int,float) else source
    if not isinstance(source,str) or not source or len(source)>192:raise ValueError('Invalid formula')
    try:tree=ast.parse(source,mode='eval')
    except (SyntaxError,RecursionError) as exc:raise ValueError('Invalid formula syntax') from exc
    nodes=list(ast.walk(tree))
    if len(nodes)>48:raise ValueError('Formula is too complex')
    for node in nodes:
        if not isinstance(node,ALLOWED):raise ValueError('Unsupported formula operation')
        if isinstance(node,ast.Name) and node.id not in names|set(FUNCS):raise ValueError('Unknown formula variable: '+node.id)
        if isinstance(node,ast.Call) and (not isinstance(node.func,ast.Name) or node.func.id not in FUNCS or node.keywords or len(node.args)>4):raise ValueError('Unsupported formula function')
        if isinstance(node,ast.Constant):
            if type(node.value) in (int,float):number(node.value)
            elif type(node.value) is not bool and (not isinstance(node.value,str) or len(node.value)>80):raise ValueError('Invalid formula constant')
    return source,tree.body


def scalar(value):
    return float(value) if type(value) is bool else number(value)


def evaluate(node,env):
    if isinstance(node,ast.Constant):return node.value
    if isinstance(node,ast.Name):return env[node.id]
    if isinstance(node,ast.IfExp):return evaluate(node.body if evaluate(node.test,env) else node.orelse,env)
    if isinstance(node,ast.BoolOp):
        result=isinstance(node.op,ast.And)
        for value in node.values:
            result=bool(evaluate(value,env))
            if result != isinstance(node.op,ast.And):break
        return result
    if isinstance(node,ast.UnaryOp):
        value=evaluate(node.operand,env)
        if isinstance(node.op,ast.Not):return not value
        result=-scalar(value) if isinstance(node.op,ast.USub) else scalar(value)
    elif isinstance(node,ast.BinOp):
        a,b=scalar(evaluate(node.left,env)),scalar(evaluate(node.right,env))
        if isinstance(node.op,ast.Add):result=a+b
        elif isinstance(node.op,ast.Sub):result=a-b
        elif isinstance(node.op,ast.Mult):result=a*b
        elif isinstance(node.op,ast.Div):result=a/b
        else:result=a%b
    elif isinstance(node,ast.Call):result=FUNCS[node.func.id](*(scalar(evaluate(a,env)) for a in node.args))
    elif isinstance(node,ast.Compare):
        a=evaluate(node.left,env)
        for op,part in zip(node.ops,node.comparators):
            b=evaluate(part,env)
            if isinstance(op,ast.Eq):ok=a==b
            elif isinstance(op,ast.NotEq):ok=a!=b
            elif isinstance(op,ast.Lt):ok=a<b
            elif isinstance(op,ast.LtE):ok=a<=b
            elif isinstance(op,ast.Gt):ok=a>b
            else:ok=a>=b
            if not ok:return False
            a=b
        return True
    else:raise ValueError('Unsupported formula')
    return scalar(result)


def definition(raw):
    if not isinstance(raw,dict) or set(raw)-{'format','version','api','id','name','author','description','revision','kind','parameters','inputs','state','when','operations'}:raise ValueError('Unknown effect fields')
    if raw.get('format')!=FORMAT or type(raw.get('version')) is not int or raw['version']!=1 or type(raw.get('api')) is not int or raw['api']!=1:raise ValueError('Unsupported effect format/API')
    if not isinstance(raw.get('id'),str) or not SLUG.fullmatch(raw['id']):raise ValueError('Invalid effect ID')
    if raw.get('kind','effect') not in ('effect','behavior'):raise ValueError('Invalid extension kind')
    result={'format':FORMAT,'version':1,'api':1,'id':raw['id'],'name':text(raw.get('name'),80),'author':text(raw.get('author',''),80),
            'description':text(raw.get('description',''),400),'revision':text(raw.get('revision','1'),32),'kind':raw.get('kind','effect')}
    if not result['name'].strip():raise ValueError('Effect name is empty')
    params,inputs,state=raw.get('parameters',{}),raw.get('inputs',{}),raw.get('state',{})
    if not all(isinstance(x,dict) for x in (params,inputs,state)) or len(params)>8 or len(inputs)>4 or len(state)>4:raise ValueError('Too many parameters, inputs or states')
    for mapping in (params,inputs,state):
        if any(not isinstance(k,str) or not SLUG.fullmatch(k) for k in mapping):raise ValueError('Invalid variable name')
    names=BASE_NAMES|{'p_'+k for k in params}|{'i_'+k for k in inputs}|{'s_'+k for k in state}
    result['parameters']={}
    for key,p in params.items():
        if not isinstance(p,dict) or set(p)!={'label','min','max','default'}:raise ValueError('Invalid parameter')
        lo,hi=number(p['min']),number(p['max'])
        if lo>hi:raise ValueError('Invalid parameter range')
        result['parameters'][key]={'label':text(p['label'],80),'min':lo,'max':hi,'default':number(p['default'],lo,hi)}
    result['inputs']={}
    for key,p in inputs.items():
        if not isinstance(p,dict) or set(p)-{'label','default'}:raise ValueError('Invalid input')
        entity=p.get('default','')
        if not isinstance(entity,str) or entity and not ENTITY.fullmatch(entity):raise ValueError('Invalid input entity')
        result['inputs'][key]={'label':text(p.get('label',key),80),'default':entity}
    result['state']={}
    for key,p in state.items():
        if not isinstance(p,dict) or set(p)!={'initial','update'}:raise ValueError('Invalid state variable')
        result['state'][key]={'initial':number(p['initial']),'update':expression(p['update'],names)[0]}
    result['when']=expression(raw.get('when','True'),names)[0]
    ops=raw.get('operations')
    if not isinstance(ops,list) or not 0<len(ops)<=8:raise ValueError('Expected 1–8 operations')
    result['operations']=[]
    for op in ops:
        if not isinstance(op,dict) or op.get('type') not in VISUAL|POLICY:raise ValueError('Unknown operation')
        kind=op['type']
        if kind in POLICY and result['kind']!='behavior':raise ValueError('Timing/hold require a behavior extension')
        keys={'r','g','b','amount'} if kind=='mix' else {'r','g','b'} if kind=='color' else {'value'}
        if set(op)!={'type'}|keys:raise ValueError('Invalid operation fields')
        result['operations'].append({'type':kind,**{k:expression(op[k],names)[0] for k in keys}})
    sources=[result["when"],*(p["update"] for p in result["state"].values()),*(v for op in result["operations"] for k,v in op.items() if k!="type")]
    if sum(len(list(ast.walk(expression(source,names)[1]))) for source in sources)>128:raise ValueError("Extension formula budget exceeds 128 nodes")
    return result


def normalize_imports(raw):
    if not isinstance(raw,list):return []
    result=[];seen=set();active=0
    for item in raw[:MAX_IMPORTS]:
        try:
            d=definition(item.get('definition'))
            if d['id'] in seen:continue
            p=item.get('parameters',{});inp=item.get('inputs',{})
            if not isinstance(p,dict) or not isinstance(inp,dict):continue
            parameters={k:min(spec['max'],max(spec['min'],number(p.get(k,spec['default'])))) for k,spec in d['parameters'].items()}
            inputs={k:inp.get(k,spec['default']) for k,spec in d['inputs'].items()}
            if any(not isinstance(v,str) or v and not ENTITY.fullmatch(v) for v in inputs.values()):continue
            lights=item.get('lights',[])
            if not isinstance(lights,list):continue
            lights=sorted({e for e in lights if isinstance(e,str) and LIGHT.fullmatch(e)})[:64]
            enabled=item.get('enabled') is True and active<4
            active+=int(enabled);seen.add(d['id'])
            result.append({'definition':d,'parameters':parameters,'inputs':inputs,'lights':lights,'enabled':enabled})
        except (ValueError,TypeError,AttributeError):continue
    return result


def _json(data):
    if len(data)>65536:raise ValueError('Effect JSON exceeds 64 KB')
    try:return json.loads(data,parse_constant=lambda _: (_ for _ in ()).throw(ValueError('Non-finite JSON')))
    except (ValueError,UnicodeError,RecursionError) as exc:raise ValueError('Invalid effect JSON') from exc


def parse_import(filename,encoded):
    if not isinstance(encoded,str) or len(encoded)>180000:raise ValueError('Effect package exceeds 128 KB')
    try:data=base64.b64decode(encoded,validate=True)
    except ValueError as exc:raise ValueError('Invalid effect file encoding') from exc
    if len(data)>131072:raise ValueError('Effect package exceeds 128 KB')
    if filename.lower().endswith('.json'):
        payload=_json(data)
        if isinstance(payload,dict) and payload.get('format')==BUNDLE:
            if type(payload.get('version')) is not int or payload['version']!=1 or set(payload)!={'format','version','effects'}:raise ValueError('Invalid effect bundle')
            values=payload['effects']
        else:values=[payload]
    elif filename.lower().endswith('.zip'):
        try:
            with ZipFile(BytesIO(data)) as archive:
                infos=archive.infolist();names=[i.filename for i in infos]
                if len(infos)>20 or len(names)!=len(set(names)) or sum(i.file_size for i in infos)>524288:raise ValueError('Invalid or oversized ZIP')
                if any(i.is_dir() or i.flag_bits&1 or i.file_size>65536 or not re.fullmatch(r'[a-zA-Z0-9_.-]{1,80}',i.filename) or i.filename in ('.','..') or ((i.external_attr>>16)&0o170000)==0o120000 for i in infos):raise ValueError('Unsupported ZIP paths or files')
                if 'manifest.json' in names:
                    manifest=_json(archive.read('manifest.json'))
                    if not isinstance(manifest,dict) or set(manifest)!={'format','version','effects'} or manifest['format']!=BUNDLE or type(manifest['version']) is not int or manifest['version']!=1 or not isinstance(manifest['effects'],list):raise ValueError('Invalid ZIP manifest')
                    files=manifest['effects']
                else:files=['effect.json']
                if len(files)>MAX_IMPORTS or any(not isinstance(f,str) or not f.endswith('.json') or f=='manifest.json' for f in files):raise ValueError('Invalid ZIP effects')
                if any(not n.endswith(('.json','.md','.txt')) for n in names):raise ValueError('Executable or unsupported package file')
                values=[_json(archive.read(f)) for f in files]
        except (BadZipFile,KeyError,RuntimeError,NotImplementedError,EOFError,ZlibError) as exc:raise ValueError('Invalid effect ZIP') from exc
    else:raise ValueError('Choose a JSON or ZIP effect package')
    if not isinstance(values,list) or not 0<len(values)<=MAX_IMPORTS:raise ValueError('Expected 1–8 effects')
    result=[definition(v) for v in values]
    if len({d['id'] for d in result})!=len(result):raise ValueError('Duplicate effect IDs')
    return result


class EffectRuntime:
    def __init__(self,imports):
        self.imports=normalize_imports(imports)
        self.reset()
        self.compiled={}
        for item in self.imports:
            d=item['definition'];names=BASE_NAMES|{'p_'+k for k in d['parameters']}|{'i_'+k for k in d['inputs']}|{'s_'+k for k in d['state']}
            for source in [d['when'],*(p['update'] for p in d['state'].values()),*(v for op in d['operations'] for k,v in op.items() if k!='type')]:
                self.compiled[source]=expression(source,names)[1]

    def reset(self):
        self.states={};self.last={};self.started=None;self.errors={};self.retry_after={};self.inputs={}

    def forget(self,entity):
        for key in list(self.states):
            if key[1]==entity:self.states.pop(key,None);self.last.pop(key,None)

    def begin(self,now,get_state):
        if self.started is None:self.started=now
        self.inputs={}
        for item in self.imports:
            if not item['enabled']:continue
            d=item['definition'];values={}
            for key,entity in item['inputs'].items():
                state=get_state(entity) if entity else None
                value=state.state if state is not None else 'unknown'
                if value in ('on','off'):value=int(value=='on')
                else:
                    try:value=number(float(value))
                    except (ValueError,TypeError):pass
                values['i_'+key]=value
            self.inputs[d['id']]=values

    def prepare(self,entity,rgb,brightness,now,metrics):
        plans=[];rate=transition=None;hold=False
        for item in self.imports:
            d=item['definition'];identity=d['id'];key=(identity,entity)
            if not item['enabled'] or entity not in item['lights'] or identity in self.errors and now<self.retry_after.get(identity,0):continue
            state=self.states.setdefault(key,{name:p['initial'] for name,p in d['state'].items()})
            env={**{k:0.0 for k in BASE_NAMES},**dict(zip(('r','g','b'),rgb)),'brightness':brightness/255*100,'time':min(1e6,max(0,now-(self.started if self.started is not None else now))),
                 'dt':min(10,max(0,now-self.last.get(key,now))),**metrics,**self.inputs.get(identity,{}),
                 **{'p_'+k:v for k,v in item['parameters'].items()},**{'s_'+k:v for k,v in state.items()}}
            try:
                new={name:scalar(evaluate(self.compiled[p['update']],env)) for name,p in d['state'].items()}
                self.states[key]=new;self.last[key]=now
                if not evaluate(self.compiled[d['when']],env):
                    self.errors.pop(identity,None);self.retry_after.pop(identity,None)
                    continue
                operations=[];local_rate=local_transition=None;local_hold=False
                for op in d['operations']:
                    values={k:scalar(evaluate(self.compiled[v],env)) for k,v in op.items() if k!='type'}
                    kind=op['type']
                    if kind=='rate':local_rate=max(.25,min(30,values['value']))
                    elif kind=='transition':local_transition=max(0,min(5,values['value']))
                    elif kind=='hold':local_hold=local_hold or bool(values['value'])
                    else:operations.append({'type':kind,**values})
                if local_rate is not None:rate=local_rate
                if local_transition is not None:transition=local_transition
                hold=hold or local_hold
                plans.append((identity,operations))
                self.errors.pop(identity,None);self.retry_after.pop(identity,None)
            except (ValueError,TypeError,KeyError,ZeroDivisionError,OverflowError) as exc:
                self.errors[identity]=str(exc)[:200] or type(exc).__name__
                self.retry_after[identity]=now+5
                self.states.pop(key,None);self.last.pop(key,None)
        return {'plans':plans,'hold':hold,'rate':rate,'transition':transition}

    def decorate(self,plan,rgb,brightness):
        reasons=[]
        for identity,operations in plan['plans']:
            for op in operations:
                kind=op['type']
                if kind=='saturation':rgb=adjust_saturation(rgb,min(200,max(0,op['value'])))
                elif kind=='brightness':brightness=round(255*min(100,max(0,op['value']))/100)
                elif kind=='brightness_scale':brightness=round(min(255,max(0,brightness*min(4,max(0,op['value'])))))
                elif kind=='hue':
                    h,s,v=colorsys.rgb_to_hsv(*(c/255 for c in rgb));rgb=tuple(round(c*255) for c in colorsys.hsv_to_rgb((h+op['value']/360)%1,s,v))
                elif kind=='color':rgb=tuple(round(min(255,max(0,op[c]))) for c in ('r','g','b'))
                elif kind=='mix':rgb,brightness=mix_lights(rgb,brightness,tuple(min(255,max(0,op[c])) for c in ('r','g','b')),brightness,min(1,max(0,op['amount'])))
            reasons.append('custom:'+identity)
        return rgb,brightness,reasons
