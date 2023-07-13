"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Loading = () => {
	const [text, setText] = useState("Loading");

	useEffect(() => {
		const interval = setInterval(() => {
			setText((prevText) =>
				prevText.length < 9 ? prevText + "." : "Loading"
			);
		}, 500); // the text updates every 500ms

		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(interval);
	}, []); // The empty array [] makes sure the effect runs once on mount and cleanup on unmount

	return (
		<div className="text-xl mt-8 text-[#6BDBD6] font-semibold">
			{text}
		</div>
	);
};

const ImageUploader = ({ setProcessedImageUrl }) => {
	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [dragOver, setDragOver] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const fileInputRef = useRef(null);

	const handleDragEnter = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setDragOver(false);
	};

	const submitFile = async () => {
		console.log("Uploading file...");
		console.log(selectedImage);
		if (selectedImage) {
			setLoading(true);
			const formData = new FormData();
			formData.append("file", selectedImage);

			axios.post(
				"https://yourt-ai.onrender.com/uploadfile",
				formData
			)
				.then(function (response) {
					const imgUrl = response.data[1];
					setProcessedImageUrl(imgUrl);
					console.log(imgUrl);
					setLoading(false);
				})
				.catch(function (error) {
					console.log(error);
					setLoading(false);
				});
		} else {
			console.log("No file selected");
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const files = e.dataTransfer.files;
		setSelectedImage(files[0]);
	};

	const handleBrowseFiles = () => {
		fileInputRef.current.click();
	};

	const handleFileSelect = (e) => {
		const files = e.target.files;
		setSelectedImage(files[0]);
	};

	const handleRemove = () => {
		setSelectedImage(null);
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div
				className={`w-[360px] h-[360px] mt-36 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400 relative ${
					dragOver ? "bg-gray-200" : ""
				}`}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{selectedImage && (
					<div className="absolute top-0 right-0 m-2">
						<button
							className="text-gray-500 rounded-full p-1 hover:bg-red-300 transition duration-200"
							onClick={handleRemove}
						>
							<svg
								className="h-4 w-4 text-red-900 opacity-40"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}
				{selectedImage ? (
					<img
						src={URL.createObjectURL(
							selectedImage
						)}
						alt="Uploaded"
						className="object-cover opacity-100 shadow-xl h-full w-full rounded-lg"
					/>
				) : (
					<div className="text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<p className="mt-1">
							Drag image here
						</p>
						<p className="text-sm text-gray-500">
							or
						</p>
						<button
							className="text-blue-500"
							onClick={handleBrowseFiles}
						>
							Browse files
						</button>
						<input
							type="file"
							className="hidden"
							ref={fileInputRef}
							onChange={handleFileSelect}
						/>
					</div>
				)}
			</div>
			{selectedImage && (
				<div className="mt-4">
					<button
						className="bg-blue-500 hover:bg-blue-300 duration-150 text-white px-4 py-2 rounded-md"
						onClick={submitFile}
					>
						Submit
					</button>
					<div></div>
				</div>
			)}
			{!selectedImage && (
				<div className="mt-4">
					<div
						className="bg-gray-300 text-white px-4 py-2 rounded-md"
						onClick={submitFile}
					>
						Submit
					</div>
				</div>
			)}
			{loading && <Loading />}
		</div>
	);
};

export default ImageUploader;
