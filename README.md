<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<p align="center">
    <a href="https://travis-ci.org/nestjs-community/nestjs-braintree"><img src="https://travis-ci.org/nestjs-community/nestjs-braintree.svg?branch=master"/></a>
    <a href="https://github.com/nestjs-community/nestjs-braintree/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjs-community/nestjs-braintree.svg"/></a>
    <a href='https://coveralls.io/github/nestjs-community/nestjs-braintree?branch=master'><img src='https://coveralls.io/repos/github/nestjs-community/nestjs-braintree/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
<h1 align="center">Nestjs Braintree</h1>

<p align="center">A module for <a href="https://www.braintreepayments.com/">Braintree</a> reoccurring payments and transactions built for the <a href="https://github.com/nestjs/nest">Nestjs</a> framework.</p>
<br/>
<p>Using the <a href="https://github.com/braintree/braintree_node">Braintree node SDK</a>.</p>

> NOTE! Currently building

## Install

```bash
$ yarn add nestjs-braintree //not currently published
```

## Use

### Basic use

```typescript
import { Module } from '@nestjs/common';
import { BraintreeModule } from 'nestjs-braintree';
import * as braintree from 'braintree';

@Module({
  imports: [
    BraintreeModule.forRoot({
      environment: braintree.Environment.Sandbox,
      merchantId: '',
      publicKey: '',
      privateKey: '',
    }),
  ],
})
export default class AppModule {}
```

### In a subModule
```typescript
import { Module } from '@nestjs/common';
import { BraintreeModule } from 'nestjs-braintree';

@Module({
  imports: [
    BraintreeModule.forFeature(),
  ],
})
export default class SubModule {}
```

### Use with nestjs-config

```typescript
import { Module } from '@nestjs/common';
import { BraintreeModule } from 'nestjs-braintree';
import { ConfigModule, ConfigService } from 'nestjs-config';

@Module({
  imports: [
    ConfigModule.load('root/to/config/*/**.{ts,js}'),
    BraintreeModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('braintree'),
      inject: [ConfigService],
    }),
  ],
})
export default class AppModule {}

//config/braintree.ts
import * as braintree from 'braintree';

export default {
  environment:
    process.env.NODE_ENV == 'development'
      ? braintree.Environment.Sandbox
      : braintree.Environment.Live,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
};
```

## Webhooks

When using subscriptions with braintree, braintree will issue webhooks to your
endpoint which you can use the decorators to handle those actions.

```typescript
import { Module } from '@nestjs/common';
import {
  BraintreeModule,
  BraintreeWebhookModule,
  BraintreeSubscriptionCanceled,
  BraintreeSubscriptionExpired,
} from 'nestjs-braintree';
import { ConfigModule, ConfigService } from 'nestjs-config';

class SubscriptionProvider {
  @BraintreeSubscriptionCanceled()
  canceled() {
    console.log('subscription canceled');
  }

  @BraintreeSubscriptionExpired()
  expired() {
    console.log('subscription expired');
  }
}

@Module({
  imports: [
    ConfigModule.load('root/to/config/*/**.{ts,js}'),
    BraintreeModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('braintree'),
      inject: [ConfigService],
    }),
    BraintreeWebhookModule,
  ],
  providers: [SubscriptionProvider],
})
export default class AppModule {}
```

## Transactions

Braintree is also capable of making one off transactions

```typescript
import { Module } from '@nestjs/common';
import { BraintreeModule, InjectBraintreeProvider } from 'nestjs-braintree';
import { ConfigModule, ConfigService } from 'nestjs-config';

class TransactionProvider {
  constructor(
    @InjectBraintreeProvider()
    private readonly braintreeProvider: BraintreeProvider,
  ) {}

  takePayment(amount: number) {
    //Will probably be similar to sale https://developers.braintreepayments.com/guides/transactions/node#settlement
    this.braintreeProvider.notImplementedYet(amount);
  }
}

@Module({
  imports: [
    ConfigModule.load('root/to/config/*/**.{ts,js}'),
    BraintreeModule.forRoot({
      useFactory: async (config: ConfigService) => config.get('braintree'),
      inject: [ConfigService],
    }),
  ],
  providers: [TransactionProvider],
})
export default class AppModule {}
```
