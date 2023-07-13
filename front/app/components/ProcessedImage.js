const ProcessedImage = ({ processedImageUrl }) => {
	if (processedImageUrl !== null) {
		return (
			<div className="my-24 text-center text-xl font-bold text-[#304d72]">
				<div className="my-4">
					Your{" "}
					<span className="text-[#6BDBD6]">
						dream house
					</span>{" "}
					is ready.
				</div>
				<a
					className="flex justify-center drop-shadow-xl m-auto"
					href={processedImageUrl}
				>
					<img
						src={processedImageUrl}
						alt="Processed"
						className="rounded-md w-[480px] h-auto"
					/>
				</a>
			</div>
		);
	} else return <div></div>;
};

export default ProcessedImage;
