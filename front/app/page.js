import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="text-center addbg m-auto">
			<div className="pb-36 addbg ">
				<div className=" shadow-[#6BDBD6] pt-48 text-7xl font-black text-[#304d72] lg:w-[720px] m-auto">
					Build the{" "}
					<span className="text-[#6BDBD6]">house</span>{" "}
					of your dreams
				</div>
				<div className="lg:w-[720px] font-normal text-[#304d72] m-auto pt-16 pb-20 text-lg">
					Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Suscipit impedit vel eius
					voluptatum. Facere laboriosam quibusdam
					dolorem in consectetur doloribus placeat!
					Eaque tempore recusandae quasi cum. Maiores
					earum quibusdam deleniti?
				</div>
				<Link
					className="lg:text-3xl 
        font-semibold
        hover:bg-[#304d72] duration-150
        lg:p-3 lg:px-8 p-3 rounded-2xl bg-[#6BDBD6] text-white"
					href="/pages/TransformYurt"
				>
					Start
				</Link>
			</div>
			<div className="flex py-28 justify-around m-auto w-[960px]">
				<div>
					<img
						src={"before1.jpeg"}
						className="rounded-2xl w-[360px] h-auto shadow-xl"
					></img>
					<div className="my-4 text-2xl font-bold text-[#304d72]">
						Before
					</div>
				</div>
				<div>
					<img
						src={"after1.png"}
						className="rounded-2xl w-[360px] h-auto shadow-xl"
					></img>
					<div className="my-4 text-2xl font-bold text-[#304d72]">
						After
					</div>
				</div>
			</div>
		</div>
	);
}
