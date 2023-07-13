import React from "react";

const VerticalNavbar = () => {
	return (
		<div className="flex flex-col bg-[#fafafa] shadow-xl h-[1080px] text-[#304d72] w-[480px]">
			<div className="flex flex-col items-center justify-center py-4">
				<span className="text-lg font-bold">Settings</span>
			</div>
			<div className="flex flex-col items-center justify-start flex-grow overflow-y-auto">
				<div className="p-4">
					<label htmlFor="brightness" className="mb-2">
						Brightness
					</label>
					<input
						type="range"
						id="brightness"
						name="brightness"
						className="w-full"
						min="0"
						max="100"
					/>
				</div>
				<div className="p-4">
					<label htmlFor="contrast" className="mb-2">
						Contrast
					</label>
					<input
						type="range"
						id="contrast"
						name="contrast"
						className="w-full"
						min="0"
						max="100"
					/>
				</div>
				<div className="p-4">
					<label htmlFor="saturation" className="mb-2">
						Saturation
					</label>
					<input
						type="range"
						id="saturation"
						name="saturation"
						className="w-full"
						min="0"
						max="100"
					/>
				</div>
				<div className="p-4">
					<label htmlFor="hue" className="mb-2">
						Hue
					</label>
					<input
						type="range"
						id="hue"
						name="hue"
						className="w-full"
						min="0"
						max="360"
					/>
				</div>
				{/* Add more settings here */}
			</div>
		</div>
	);
};

export default VerticalNavbar;
