import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getProductById(id);  
        }
    }, [id]);
    
    const getProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/products/${id}`);
            setName(response.data.name);
            setFile(response.data.image); 
            setPreview(response.data.url); 
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        if (file) {
            formData.append("file", file);
            formData.append("name", name);
        }
        
        

        try {
            await axios.patch(`http://localhost:5000/products/${id}`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            navigate("/", { state: { reload: true } });
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="columns is-centered mt-5">
            <div className="column is-half">
                <form onSubmit={updateProduct}>
                    <div className="field">
                        <label className="label">Product Name</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Product Name"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Image</label>
                        <div className="control">
                            <div className="file">
                                <label className="file-label">
                                    <input
                                        type="file"
                                        className="file-input"
                                        onChange={loadImage}
                                    />
                                    <span className="file-cta">
                                        <span className="file-label">Choose a file...</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {preview && (
                        <figure className="image is-128x128">
                            <img src={preview} alt="Product Preview" />
                        </figure>
                    )}

                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-success">
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
