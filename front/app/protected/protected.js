export async function getServerSideProps(context) {
    const { req } = context;
    const cookies = req.headers.cookie;
  
    if (!cookies || !cookies.includes('token')) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  }
  
  const ProtectedPage = () => {
    return <div>This is a protected page</div>;
  };
  
  export default ProtectedPage;
  