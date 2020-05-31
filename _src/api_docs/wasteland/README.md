---
title: "README"
menuTitle: "README"
---
# wasteland

Wasteland is a modular data layer for [storing data in DHT](http://www.bittorrent.org/beps/bep_0044.html) and other backends. Storage adapters are pluggable, right now Grenache (DHT) and in-memory backends are included.

As payload size is limited to [1000 bytes per spec](http://www.bittorrent.org/beps/bep_0044.html), DHT storage supports chunking with indirect pointers. We can store 996 chars in a 1000 byte buffer, and 22 pointers per 1000 bytes, so with just single indirect pointers we can store up to 21.912KB.

## Mutable Data

Data updates and update conflicts: for data updates a `seq` property must be used, which increases monotonically. This way we can make sure that a client does not overwrite outdated data. Updates and conflicts have to get handled at the client side, specific to the use case (e.g. "last-write-wins" or manual conflict resolution).

Salts are used to store different values with the same key pair. If the salt is omitted, Wasteland generates it. For data that is stored in chunks, the salt is generated by hashing the stored data plus a random modifier.

Data is signed using public/private keys (ed25519).

You can find examples for both mutable and immutable data in [the examples folder](/examples/).

## Immutable Data

Immutable data is not signed. It is just a hash of the stored content. That means there can be no duplicate content. In case of duplicate content the write succeed, and return the same hash as for the previous result. The hash that is also used as key / storage address is simply a hash of the stored content.

You can find examples for both mutable and immutable data in [the examples folder](/examples/).


## Storage Backends

Wasteland comes with backends for Grenache and In-Memory storage. Plugging in new backends is no problem.

### Example using Grenache:

Run two Grapes:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

```js
const Wasteland = require('wasteland')
const GrenacheBackend = require('wasteland/backends/Grenache')

const Link = require('grenache-nodejs-link')
const ed = require('ed25519-supercop')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const { publicKey, secretKey } = ed.createKeyPair(ed.createSeed())

const gb = new GrenacheBackend({
  transport: link,
  keys: { publicKey, secretKey }
})

const wl = new Wasteland({ backend: gb })

const opts = { seq: 1, salt: 'pineapple-salt' }
wl.put('unchunked-data', opts, (err, hash) => {
  if (err) throw err

  wl.get({ hash: hash, salt: 'pineapple-salt' }, {}, (err, data) => {
    if (err) throw err

    console.log(data)
    cb(null)
  })
})

```

**Response:**

```js
{ id: '1da41d4e30c74fa5b0d9a7e4cf60c1bf9402b0f1',
  token: null,
  v: 'unchunked-data',
  sig: 'f84062a412736d3219bcf7fd40fee911427d03391bd455a53545f971f2eac20b85aed3dac8baafee777905becbcfff312a47bd5aa50aa66f040e39b8e5739901',
  k: 'e33a423dcbf900727afcaf16622ad3263104874dc3031260eb82825db3ae7c2a',
  salt: 'pineapple-salt',
  seq: 1 }
```


[grenache.js](./examples/grenache.js)

### Custom Backends

## Data Model

### Wasteland pointers

Pointers to data or other pointers are stored in the following format:

```
{ wasteland_type: 'pointers',
  p:
   [ [ '8e65439da41c0263512d965af3b45e750379f808',
       '109eb3bb524d9fce41af8b232b14353ec922f357' ],
     [ '0533d23c50b8e9a33ab89dd9a2f1cb3323695375',
       '9c5519b713a16afd0f411b7b53720f508dcf6319' ] ] }
```

In this case the first chunk has the hash `8e65439da41c0263512d965af3b45e750379f808` and because it is stored as mutable, it has a salt of `109eb3bb524d9fce41af8b232b14353ec922f357`.

The second chunk has the hash `0533d23c50b8e9a33ab89dd9a2f1cb3323695375` and the salt `9c5519b713a16afd0f411b7b53720f508dcf6319`.

Immutable data has no salt, so the second index is `null`:

```
{ wasteland_type: 'pointers',
  p:
   [ [ '3465439da41c0263512d965af3b45e750379f808',
       null ],
     [ 'ea33d23c50b8e9a33ab89dd9a2f1cb3323695375',
       null ] ] }
```


### BEP 44 data models

These are the data models each storage-backend has to implement.

**get Responses:**

```
{
  "id": <20 byte id of sending node/database (string)>,
  "seq": <monotonically increasing sequence number (integer), used for versioning>,
  "sig": <ed25519 signature (64 bytes string)>,
  "v": <the data payload>,
  "k": <ed25519 public key>
}
```