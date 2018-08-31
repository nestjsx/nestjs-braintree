import { Test } from '@nestjs/testing';
import * as braintree from 'braintree';
import { ConfigService, ConfigModule } from 'nestjs-config';
import * as path from 'path';
import {
  BraintreeModule,
  BRAINTREE_OPTIONS_PROVIDER,
  BraintreeProvider,
  InjectBraintreeProvider,
} from '..';

describe('Braintree Module', () => {
  it('Does it instance with options using registry', async () => {
    const module = await Test.createTestingModule({
      imports: [
        BraintreeModule.forRoot({
          environment: braintree.Environment.Sandbox,
          merchantId: 'merchantId',
          publicKey: 'publicKey',
          privateKey: 'privateKey',
        }),
      ],
    }).compile();

    const options = module.get(BRAINTREE_OPTIONS_PROVIDER);
    const provider = module.get<BraintreeProvider>(BraintreeProvider);

    expect(options.environment).toBe(braintree.Environment.Sandbox);
    expect(options.merchantId).toBe('merchantId');
    expect(options.publicKey).toBe('publicKey');
    expect(options.privateKey).toBe('privateKey');
    expect(provider).toBeInstanceOf(BraintreeProvider);
  });

  it('Does it instance with options using async registry', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
        ),
        BraintreeModule.forRootAsync({
          useFactory: config => config.get('braintree'),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    const options = module.get(BRAINTREE_OPTIONS_PROVIDER);
    const provider = module.get<BraintreeProvider>(BraintreeProvider);

    expect(options.environment).toBe(braintree.Environment.Sandbox);
    expect(options.merchantId).toBe('merchantId');
    expect(options.publicKey).toBe('publicKey');
    expect(options.privateKey).toBe('privateKey');
    expect(provider).toBeInstanceOf(BraintreeProvider);
  });

  it('BraintreeProvider is avaliable to providers', async () => {
    class TestProvider {
      constructor(
        @InjectBraintreeProvider()
        private readonly braintreeProvider: BraintreeProvider,
      ) {}

      getProvider(): BraintreeProvider {
        return this.braintreeProvider;
      }
    }

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
        ),
        BraintreeModule.forRootAsync({
          useFactory: config => config.get('braintree'),
          inject: [ConfigService],
        }),
      ],
      providers: [TestProvider],
    }).compile();

    const provider = module.get<TestProvider>(TestProvider);

    expect(provider.getProvider()).toBeInstanceOf(BraintreeProvider);
  });
});
