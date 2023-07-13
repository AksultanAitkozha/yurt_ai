const AboutPage = () => {
	return (
		<div className="w-[720px] text-xl text-[#304d72] py-36 m-auto">
			<img
				src="/logo.png"
				className="w-48 m-auto drop-shadow-sm"
			></img>
			<div className="py-6">
				This app was created by{" "}
				<span className="font-bold">Aksultan Aitkozha</span>
				, with the use of the following technologies:
			</div>
			<ul className="">
				<li>• ControlNet</li>
				<li>• Stable Diffusion</li>
				<li>• GPT-3.5</li>
			</ul>
			<div className="flex justify-center w-[600px] pt-12 m-auto">
				<a
					href="http://github.com/AksultanAitkozha"
					className="flex py-5 bg-[#304d72] mt-5 justify-center space-x-2 font-bold text-white w-[200px] h-[60px] rounded-xl m-auto items-center hover:bg-[#6BDBD6] duration-150"
				>
					<div className="w-[24px]">
						<img src="/githublogo.png"></img>
					</div>
					<div>GitHub page</div>
				</a>
			</div>
		</div>
	);
};

export default AboutPage;
