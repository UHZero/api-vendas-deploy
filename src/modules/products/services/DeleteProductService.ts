import AppError from '@shared/errors/AppErrors';
import ProductRepository from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from 'typeorm';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found!');
    }
    // const redisCache = new RedisCache();

    await RedisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
