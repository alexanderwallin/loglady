# loglady

![](https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmedia-cache-ak0.pinimg.com%2F736x%2F42%2Fdb%2Faa%2F42dbaad8be6ffbc091b323770f6a0944.jpg&f=1)

Pretty logging for cli apps or for when debugging

## Installation

```bash
npm install loglady
```

## Usage

```javascript
const loglady = require('loglady');

loglady.setMuted(isMuted);
loglady.setVerbose(isVerbose);
loglady.json(json);
loglady.error(err);
loglady.pipeStdout(data);
loglady.section(heading);
loglady.action(heading);
loglady.command(cmd);
loglady.fncall(fn);
loglady.intermediate(message);
loglady.showIntroHeader(title);
loglady.endWithABang(msg);
loglady.endInTotalDespair(err);
```
