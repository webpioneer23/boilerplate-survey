import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Product from '../Product/Product';
import './ProductList.scss';
import { ProducListProps } from '../types';

const ProductList = (props) => {

    const renderLoading = () => {
        return <div>CUSTOM LOADING</div>;
    }

    const { products, firstLoad, isFeatured, handleItemLike } = props;

    if (firstLoad) {
        return renderLoading();
    }

    return (
        <section className={`ProductList ${firstLoad ? 'loading' : ''}`}>
            {products.map((item, index) =>
                item ? (
                    <Product
                        item={{ ...products[index], out_of_stock: true, productUrl: item.purchaseUrl }}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`Product-${index}`}
                        isFeatured={isFeatured}
                    />
                ) : (
                    ''
                ),
            )}
        </section>
    );
}


ProductList.propTypes = {
    products: PropTypes.array,
    firstLoad: PropTypes.bool,
    isFeatured: PropTypes.bool,
    handleItemLike: PropTypes.func,
};

export default ProductList;
