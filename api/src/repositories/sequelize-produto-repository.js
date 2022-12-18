const { Op } = require('sequelize');
const { Produto: ProdutoModel } = require('../database/models');
const Produto = require('../entities/produto');

class SequelizeProdutoRepository {
  static async create(produto) {
    await ProdutoModel.create(produto);
  }

  static async existsBySku(sku) {
    const produto = await ProdutoModel.findByPk(sku);
    return produto !== null;
  }

  static async getAll({
    porPagina,
    pagina,
    ordenarPor,
    ordem,
    tituloProduto,
    preco,
    estoque,
  }) {
    const storedProdutos = await ProdutoModel.findAll({
      limit: porPagina,
      offset: porPagina * (pagina - 1),
      order: [[ordenarPor, ordem]],
      where: {
        tituloProduto: { [Op.substring]: tituloProduto },
        ...(preco !== undefined && { preco }),
        ...(estoque !== undefined && { estoque }),
      },
    });
    return storedProdutos.map((storedProduto) => new Produto(storedProduto));
  }
}

module.exports = SequelizeProdutoRepository;
