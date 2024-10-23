export default async function handler(req, res) {
	const { id } = req.query;
	const response = await fetch(`http://localhost:4343/api${id}`);
	const product = await response.json();

	res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
	res.status(200).json(product);
}
