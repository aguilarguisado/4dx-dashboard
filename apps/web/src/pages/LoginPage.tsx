import { LoginContainer } from '@/features/login';
import { useTranslation } from '@/hooks/UseTranslation';

export const LoginPage = () => {
	const title1 = useTranslation({ id: 'login.title.1' });
	const title2 = useTranslation({ id: 'login.title.2' });
	const subtitle = useTranslation({ id: 'login.subtitle' });
	return (
		<div
			className="bg-primary flex align-items-center justify-content-center"
			style={{ height: '100vh', margin: '-8px' }}
		>
			<div className="grid grid-nogutter surface-0 text-800">
				<div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
					<section>
						<span className="block text-6xl font-bold mb-1">{title1}</span>
						<div className="text-6xl text-primary font-bold mb-3">{title2}</div>
						<p className="mt-0 mb-4 text-700 line-height-3">{subtitle}</p>
						<LoginContainer />
					</section>
				</div>
				<div className="col-12 md:col-6 overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=
          rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="hero-1"
						className="md:ml-auto block md:h-full"
						style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)', maxHeight: '700px' }}
					/>
				</div>
			</div>
		</div>
	);
};
