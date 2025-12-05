const { products, categories } = require("../models");
const { Op } = require('sequelize');

class ProductsController {

    constructor() {
        this.getProducts = this.getProducts.bind(this);
    }

    async getProducts(req, res, next) {
        let { page, limit, sort, fields, include, filter } = req.query;

        let offset, order, attributes, itemInclude, where;
        limit = Number(limit);
        page = Number(page);

        try {
            offset = this.CalculOffset(page, limit);

            const allowedSort = ["name", "price", "created_at", "id"];
            order = this.getOrder(allowedSort, sort);

            const allowedFields = Object.keys(products.rawAttributes);
            attributes = this.getAttributes(allowedFields, fields);

            itemInclude = this.getIncludes(include);

            const allowedFilter = ["category", "price", "id"];
            where = await this.getWhereItems(allowedFilter, filter);

        } catch (err) {
            return res.status(400).json({ message: "Champ obligatoire manquant ou incorrect", error: err.message });
        }

        try {
            const result = await products.findAndCountAll({
                limit,
                offset,
                order,
                attributes,
                include: itemInclude,
                where
            });

            res.json({
                page,
                limit,
                total: result.count,
                totalPages: Math.ceil(result.count / limit),
                data: result.rows
            });

        } catch (err) {
            next(err);
        }
    }

    CalculOffset(page, limit) {
        if (!page || isNaN(page) || !limit || isNaN(limit)) {
            throw new Error(` non autorisé `);
        }
        return (page - 1) * limit;
    }

    getAttributes(allowedFields, field) {
        if (!field || typeof field !== "string") throw new Error(` non autorisé `);
        const tabItems = field.split(",");
        if (!tabItems.every(item => allowedFields.includes(item))) throw new Error(` non autorisé `);
        return tabItems;
    }

    getOrder(allowedSort, sort) {
        if (!sort || typeof sort !== "string") throw new Error(` non autorisé `);

        const result = sort.split(",").map(el => ({
            value: el[0] === "-" ? el.slice(1) : el,
            desc: el[0] === "-"
        }));

        if (!result.every(item => allowedSort.includes(item.value))) throw new Error(` non autorisé `);

        return result.map(item => [item.value, item.desc ? "DESC" : "ASC"]);
    }

    getIncludes(include) {
        const tabItems = [];
        if (include && typeof include === "string" && include === "category") {
            tabItems.push({ model: categories, as: include });
        }
        return tabItems;
    }

    async getWhereItems(allowedFilter, filterQuery) {
        const where = {};

        if (!filterQuery || typeof filterQuery !== 'object') throw new Error(` non autorisé `);

        for (const field in filterQuery) {
            if (!allowedFilter.includes(field)) throw new Error(` non autorisé `);

            const value = filterQuery[field];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                where[field] = {};
                for (const op in value) {
                    const raw = value[op];
                    switch (op) {
                        case 'gt': where[field][Op.gt] = Number(raw); break;
                        case 'gte': where[field][Op.gte] = Number(raw); break;
                        case 'lt': where[field][Op.lt] = Number(raw); break;
                        case 'lte': where[field][Op.lte] = Number(raw); break;
                        case 'eq': where[field][Op.eq] = isNaN(raw) ? raw : Number(raw); break;
                        case 'ne': where[field][Op.ne] = isNaN(raw) ? raw : Number(raw); break;
                        case 'like': where[field][Op.like] = `%${raw}%`; break;
                        case 'in': where[field][Op.in] = Array.isArray(raw) ? raw.map(r => isNaN(r) ? r : Number(r)) : [isNaN(raw) ? raw : Number(raw)]; break;
                        default: where[field][op] = raw;
                    }
                }
            } else {
                if (Array.isArray(value)) throw new Error(` non autorisé `);
                if (field === "category") {
                    const newValue = await categories.findOne({ attributes: ["id"], where: { name: value } });
                    if (!newValue) throw new Error(`Category not found`);
                    where["category_id"] = newValue.id;
                } else {
                    where[field] = isNaN(value) ? value : Number(value);
                }
            }
        }

        return where;
    }

}

module.exports = new ProductsController();