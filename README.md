<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<p align="center">
    <a href="https://travis-ci.org/nestjs-community/nestjs-braintree"><img src="https://travis-ci.org/nestjs-community/nestjs-braintree.svg?branch=master"/></a>
    <a href="https://www.npmjs.com/package/nestjs-braintree"><img src="https://img.shields.io/npm/v/nestjs-braintree.svg"/></a>
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
$ yarn add nestjs-braintree
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
  BraintreeWebhookHandler,
} from 'nestjs-braintree';
import { ConfigModule, ConfigService } from 'nestjs-config';

@BraintreeWebhookHandler()
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

### Use Example 
The idea of the Braintree Webhook Module is to make implementation of actions a lot easier. For example we can build a provider like this one to cancel canceled subscriptions. 

```ts
@BraintreeWebhookHandler()
export class SubscriptionProvider {
  constructor(@InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>) {}

  async findByBraintreeId(id: string): Promise<Subscription|null> {
    return await this.repository.find({
      where: braintreeId: id,
    });
  }

  async update(subscription: Subscription): Promise<boolean> {
    return await this.subscriptionRepository.update(subscription);
  }

  @BraintreeSubscriptionCanceled()
  async canceled(webhook) {
    const subscription = await this.findByBraintreeId(webhook.subscription.id);
    if (!subscription) {
      return;
    }
    subscription.active = false;
    await this.update(subscription);
  }
}
```

### Available webhooks 

Shortname | Braintree webhook name/const/key | NestJS decorator
--- | --- | ---
Subscription Canceled | `subscription_canceled` | `@BraintreeSubscriptionCanceled()`
Subscription Expired | `subscription_expired` | `@BraintreeSubscriptionExpired()`
Subscription Charged Successfully | `subscription_charged_successfully` | `@BraintreeSubscriptionChargedSuccessfully()`
Subscription Charged Unsuccessfully | `subscription_charged_unsuccessfully` | `@BraintreeSubscriptionChargedUnsuccessfully()`
Subscription Went Active | `subscription_went_active` | `@BraintreeSubscriptionWentActive()`
Subscription Went Past Due | `subscription_went_past_due` | `@BraintreeSubscriptionWentPastDue()`
Subscription Trial Ended | `subscription_trial_ended` | `@BraintreeSubscriptionTrialEnded()`

You can find out more about the webhooks [here](https://developers.braintreepayments.com/reference/general/webhooks/overview). 

#### Custom routing for webhooks
You may want to divert from the default routing of `{your_domain}/braintree/webhook` for whatever reason. You can do so using the `forRoot` method on the `BraintreeWebhookModule` like so

```ts
@Module({
  imports: [
    ConfigModule.load('root/to/config/*/**.{ts,js}'),
    BraintreeModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('braintree'),
      inject: [ConfigService],
    }),
    BraintreeWebhookModule.forRoot({
      root: 'replace-braintree',
      handle: 'replace-webhook',
    }),
  ],
  providers: [SubscriptionProvider],
})
export default class AppModule {}
```

The above will result in your route for your braintree webhooks being `{your_domain}/replace-braintree/replace-webhook`

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
