import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const pokemonModel = this.pokemonService.pokemonModel;

    try {
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      );

      const pokemons = [];
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');

        const no = +segments[segments.length - 2];

        pokemons.push({
          name: name,
          no: no,
        });
      });

      const insertedPokemons = await pokemonModel.insertMany(pokemons);
      return insertedPokemons;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon existe en la db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Error create pokemon - chequear logs del servidor`,
    );
  }
}
