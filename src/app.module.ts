import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvCOnfiguration } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvCOnfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    //update
    MongooseModule.forRoot(
      'mongodb+srv://eduardo:elm141595@cluster0.61bwl5d.mongodb.net/pokemons',
    ),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  exports: [PokemonModule],
})
export class AppModule {
  constructor() {
    console.log(process.env.MONGODB);
  }
}
