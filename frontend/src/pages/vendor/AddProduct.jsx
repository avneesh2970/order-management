import Layout from "../../components/common/Layout";
import ProductForm from "../../components/forms/ProductForm";
import API from "../../services/api";

export default function AddProduct() {
  const submit = async (form) => {
    await API.post("/products", form);
    alert("Product added");
  };

  return (
    <Layout>
      <ProductForm onSubmit={submit} />
    </Layout>
  );
}