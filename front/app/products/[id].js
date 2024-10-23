export async function getStaticProps({ params }) {
	const res = await fetch(`http://localhost:4343/api${params.id}`);
	const product = await res.json();

	return {
		props: {
			product,
		},
		revalidate: 60,
	};
}

export async function getStaticPaths() {
	const res = await fetch('http://localhost:4343/api');
	const products = await res.json();

	const paths = products.map((product) => ({
		params: { id: product.id.toString() },
	}));

	return { paths, fallback: 'blocking' };
}

const ProductPage = ({ product }) => {
	return (
		<div>
			<h1>{product.name}</h1>
			<p>{product.description}</p>
		</div>
	);
};

export default ProductPage;
