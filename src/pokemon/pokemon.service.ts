import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    public readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    const port = configService.get<number>('port');
    console.log(port);
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon con el id, name o no "${term}" no funciona`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //const pokemon = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon con el id "${id}" no existe`);
    }
    return;
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
