
export async function getServerSideProps({ params, res }) {
	const response = await fetch(`http://localhost:4343/api/${params.id}`);
	const post = await response.json();

	res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

	return {
		props: {
			post,
		},
	};
}

const BlogPost = ({ post }) => {
	return (
		<div>
			<h1>{post.title}</h1>
			<p>{post.content}</p>
		</div>
	);
};

export default BlogPost;