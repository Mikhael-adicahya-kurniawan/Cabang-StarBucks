import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/products");
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/products/${productId}`);
            // Perbarui status produk setelah penghapusan
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
            getProducts();
        } catch (error) {
            console.log('Error deleting product:', error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="container mt-5">
            <Link className='button is-success' to={"/add"}> Add New Product </Link>
            <div className="columns is-multiline mt-5">
                {products.map((product) => (
                    <div className="column is-one-quarter" key={product.id}>
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                    <img src={product.url} alt="Product" />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">{product.name}</p>
                                    </div>
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to={`edit/${product.id}`} className="card-footer-item">Edit</Link>
                                <button
                                    className="card-footer-item"
                                    onClick={() => deleteProduct(product.id)}
                                    type="button"
                                >
                                    Delete
                                </button>
                            </footer>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
