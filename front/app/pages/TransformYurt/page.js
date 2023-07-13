"use client";
import { useState } from "react";
import VerticalNavbar from "../../components/VerticalNavbar";
import ImageUploader from "../../components/ImageUpLoader";
import ProcessedImage from "../../components/ProcessedImage";
const TransformYurtPage = () => {
	const [processedImageUrl, setProcessedImageUrl] = useState(null);
	return (
		<div>
			<ImageUploader
				setProcessedImageUrl={setProcessedImageUrl}
			/>
			<ProcessedImage processedImageUrl={processedImageUrl} />
		</div>
	);
};

export default TransformYurtPage;
