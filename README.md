<p align="center"><img src="https://avatars1.githubusercontent.com/u/41109786?s=200&v=4"/></p>
<p align="center">
    <a href="https://github.com/nestjs-community/nestjs-braintree/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjs-community/nestjs-braintree.svg"/></a>
</p>
<h1 align="center">Nestjs Braintree</h1>

<p align="center">A braintree module for braintree reoccurring payments and transactions.</p>

> NOTE! Currently building

## Install 

```bash
$ yarn add nestjs-braintree //not currently published
```

## Use 

### Basic use

```typescript
import {Module} from '@nestjs/common';
import {BraintreeModule} from 'nestjs-braintree';

@Module({
    imports: [
        BraintreeModule.registry({
            environment: 'sandbox',
            merchantId: '',
            publicKey: '',
            privateKey: '',
        }),
    ],
})
export default class AppModule {}
```
### Use with nestjs-config

```typescript
import {Module} from '@nestjs/common';
import {BraintreeModule} from 'nestjs-braintree';
import {ConfigModule, ConfigService} from 'nestjs-config';

@Module({
    imports: [
        ConfigModule.load('root/to/config/*/**.{ts,js}'),
        BraintreeModule.registryAsync({
            useFactory: async (config: ConfigService) => config.get('braintree'),
            inject: [ConfigService],
        }),
    ],
})
export default class AppModule {}

//config/braintree.ts
export default {
    environment: process.env.NODE_ENV == 'development' ? 'sandbox' : 'live',
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
}
```