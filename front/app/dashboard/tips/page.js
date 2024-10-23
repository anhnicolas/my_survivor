import AdviceList from '../../../components/AdviceList';
import AuthGuard from '../../../components/AuthGuard';

const Tips = () => {
	return (
		<AuthGuard>
		<div className="tips-page">
			<div className="main-content">
				<AdviceList />
			</div>
		</div>
		</AuthGuard>
	);
};

export default Tips;
