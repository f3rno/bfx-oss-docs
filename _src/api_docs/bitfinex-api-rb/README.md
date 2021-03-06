---
title: "README"
menuTitle: "README"
---
::: api-docs-index
[[toc]]
:::

# Bitfinex Trading API for Ruby - Bitcoin, Ethereum, Ripple and more

A Ruby reference implementation of the Bitfinex REST & WebSocket APIs.

This repo is primarily made up of 3 classes: RESTv1, RESTv2, and WSv2, which
implement their respective versions of the Bitfinex API. It is recommended that
you use the REST APIs for reading data, and the WebSocket API for submitting
orders and interacting with the Bitfinex platform.

Check the [Bitfinex API documentation](http://docs.bitfinex.com/) for more
information.

## Features

* Official implementation
* REST API v1
* REST API v2
* WebSockets API version 2

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'bitfinex-rb', :require => "bitfinex"
```

And then execute:

```bash
bundle
```

Or install it yourself as:

```bash
gem install bitfinex-rb
```

### Quickstart

```ruby
client = Bitfinex::WSv2.new({
  :api_key => ENV['API_KEY'],
  :api_secret => ENV['API_SECRET'],
  :transform => true, # provide models as event data instead of arrays
})

client.on(:open) do
  client.auth!
end

client.on(:auth) do
  puts 'succesfully authenticated'

  o = Bitfinex::Models::Order.new({
    :type => 'EXCHANGE LIMIT',
    :price => 3.0152235,
    :amount => 2.0235235263262,
    :symbol => 'tEOSUSD'
  })

  client.submit_order(o)
end
```

### Docs

YARD generated documentation is available in `docs/`. For ready to run
examples, see the [`examples/` folder](/examples).

### Examples

#### Usage of RESTv1/RESTv2

To use the REST APIs, construct a new API client with your account credentials:

```ruby
client = Bitfinex::RESTv2.new({
  :api_key => '...',
  :api_secret => '...',
})
```

Then use it to submit queries, i.e. `client.balances`

#### Usage of WSv2

To use version 2 of the WS API, construct a new client with your credentials,
bind listeners to react to stream events, and open the connection:

```ruby
client = Bitfinex::WSv2.new({
  :url => ENV['WS_URL'],
  :api_key => ENV['API_KEY'],
  :api_secret => ENV['API_SECRET'],
  :transform => true, # provide models as event data instead of arrays
  :seq_audit => true, # enable and audit sequence numbers
  :manage_order_books => true, # allows for OB checksum verification
  :checksum_audit => true # enables OB checksum verification (needs manage_order_books)
})

client.on(:open) do
  client.auth!
end

client.on(:auth) do
  puts 'succesfully authenticated'

  o = Bitfinex::Models::Order.new({
    :type => 'EXCHANGE LIMIT',
    :price => 3.0152235,
    :amount => 2.0235235263262,
    :symbol => 'tEOSUSD'
  })

  client.submit_order(o)
end

client.on(:notification) do |n|
  puts 'received notification: %s' % [n]
end

client.on(:order_new) do |msg|
  puts 'recv order new: %s' % [msg]
end

client.open!
```

#### Order Manipulation

Three methods are provided for dealing with orders: `submit_order`,
`update_order` and `cancel_order`. All methods support callback blocks, which
are triggered upon receiving the relevant confirmation notifications. Example:

```ruby
o = Bitfinex::Models::Order.new({
  :type => 'EXCHANGE LIMIT',
  :price => 3.0152235,
  :amount => 2.0235235263262,
  :symbol => 'tEOSUSD'
})

client.submit_order(o) do |order_packet|
  p "recv order confirmation packet with ID #{order_packet.id}"

  client.update_order({
    :id => order_packet.id,
    :price => '3.0'
  }) do |update_packet|
    p "updated order #{update_packet.id} with price #{update_packet.price}"

    client.cancel_order(order_packet) do |canceled_order|
      p "canceled order with ID #{canceled_order[0]}"
    end
  end
end
```

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
