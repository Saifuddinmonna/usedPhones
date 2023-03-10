import React, { useContext } from "react";
import quote from "../../../assets/icons/quote.svg";
import people1 from "../../../assets/images/people1.png";
import people2 from "../../../assets/images/people2.png";
import people3 from "../../../assets/images/people3.png";
import Review from "./Review";
import MyModal from "./AllUserCommences";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { data } from "autoprefixer";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../Shared/Loading/Loading";
import { AuthContext } from "../../../contexts/AuthProvider";

const CustomarReviews = () => {
	const { user } = useContext(AuthContext);
	console.log("for emialuser", user);
	let [isOpen, setIsOpen] = useState(false);

	const { data: userscommences = [], refetch } = useQuery({
		queryKey: ["userscommences"],
		queryFn: async () => {
			const res = await fetch(
				"https://usedphonesserver-saifuddinmonna.vercel.app/userscommences",
			);
			const data = await res.json();
			return data;
		},
	});

	const {
		data: divisions,

		isLoading2,
	} = useQuery({
		queryKey: ["division"],
		queryFn: async () => {
			const res = await fetch(
				"https://usedphonesserver-saifuddinmonna.vercel.app/divisionsnameforreview",
			);
			const data = await res.json();
			console.log("data", data);
			return data;
		},
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const imageHostKey = process.env.REACT_APP_imgbb_key;
	console.log(imageHostKey, "image key");

	const navigate = useNavigate();

	console.log(data.location);

	const handleAddPhone = (data) => {
		const image = data.image[0] ? data.image[0] : user?.photoURL;
		const multipleImage = data.multipleImage;
		const images = [image, multipleImage];
		const formData = new FormData();
		formData.append("image", image);
		const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((imgData) => {
				if (imgData.success) {
					console.log(imgData.data.url);
					console.log(data.multipleImage, "images");
					console.log(data.image, "images");
					console.log("data", data);
					const phone = {
						Name: data.name,
						Email: data.email,
						brand: data.brand,
						image: imgData.data.url,
						description: data.description,
						location: data.location,
					};

					// save phone information to the database
					fetch(
						"https://usedphonesserver-saifuddinmonna.vercel.app/userscommences",
						{
							method: "POST",
							headers: {
								"content-type": "application/json",
								authorization: `bearer ${localStorage.getItem(
									"accessToken",
								)}`,
							},
							body: JSON.stringify(phone),
						},
					)
						.then((res) => res.json())
						.then((result) => {
							console.log(result);
							toast.success(`${data.name} is added successfully`);
						});
				}
			});
	};

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const handleDeletecommence = (id) => {
		console.log("user id ffor token checj", id);
		fetch(
			`https://usedphonesserver-saifuddinmonna.vercel.app/users/${id}`,
			{
				method: "DELETE",
				headers: {
					authorization: `bearer ${localStorage.getItem(
						"accessToken",
					)}`,
				},
			},
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.deletedCount === 1) {
					toast.success("Delete Process is successful.");
					refetch();
				}
			});
	};

	return (
		<section className="my-16">
			<div>
				<div className=" ">
					<div className="border rounded-full text-center shadow-xl p-4 m-6">
						<h4 className="text-3xl text-primary font-bold">
							Customer Review
						</h4>
						<h2 className="text-4xl">What Our Customer Says</h2>
					</div>
					<div className="flex justify-around">
						<div>
							{/* modal start from here*/}

							<>
								<div className="   items-center ">
									<button
										type="button"
										onClick={openModal}
										className="rounded-md btn btn-info btn-sm bg-opacity-75 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
										Add A Review About Our Service
									</button>
								</div>

								<Transition appear show={isOpen} as={Fragment}>
									<Dialog
										as="div"
										className="relative z-10"
										onClose={closeModal}>
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-300"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="fixed inset-0 bg-black bg-opacity-25" />
										</Transition.Child>

										<div className="fixed inset-0 overflow-y-auto">
											<div className="flex min-h-full items-center justify-center p-4 text-center">
												<Transition.Child
													as={Fragment}
													enter="ease-out duration-300"
													enterFrom="opacity-0 scale-95"
													enterTo="opacity-100 scale-100"
													leave="ease-in duration-200"
													leaveFrom="opacity-100 scale-100"
													leaveTo="opacity-0 scale-95">
													<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
														<Dialog.Title
															as="h3"
															className="text-lg font-medium leading-6 text-gray-900">
															Please Review Us
														</Dialog.Title>
														<div className="mt-2">
															<div className="flex flex-col justify-center items-center mt-5 ">
																<div className="px-7 ">
																	<h2 className="text-4xl text-center">
																		Add A
																		Review
																	</h2>
																</div>
																<div className="flex flex-row justify-center items-center mx-5 my-6 ">
																	<form
																		className="text-center grid  justify-center items-center"
																		onSubmit={handleSubmit(
																			handleAddPhone,
																		)}>
																		<div className="text-center grid gap-4 md:grid-cols-2 lg:grid-cols-2  justify-center items-center">
																			<div className="form-control w-full max-w-xs">
																				<label className="label">
																					{" "}
																					<span className="label-text">
																						Name
																					</span>
																				</label>
																				<input
																					defaultValue={
																						user?.displayName
																					}
																					placeholder={
																						user?.displayName
																					}
																					type="text"
																					{...register(
																						"name",
																						{
																							required:
																								"Name is Required",
																						},
																					)}
																					className="input input-bordered w-full max-w-xs"
																				/>
																				{errors.name && (
																					<p className="text-red-500">
																						{
																							errors
																								.name
																								.message
																						}
																					</p>
																				)}
																			</div>

																			<div className="form-control w-full max-w-xs">
																				<label className="label">
																					{" "}
																					<span className="label-text">
																						Email
																					</span>
																				</label>
																				<input
																					defaultValue={
																						user?.email
																					}
																					placeholder={
																						user?.email
																					}
																					type="email"
																					{...register(
																						"email",
																						{
																							required: true,
																						},
																					)}
																					className="input input-bordered w-full max-w-xs"
																				/>
																				{errors.email && (
																					<p className="text-red-500">
																						{
																							errors
																								.email
																								.message
																						}
																					</p>
																				)}
																			</div>
																			<div className="form-control w-full max-w-xs">
																				<label className="label">
																					{" "}
																					<span className="label-text">
																						Location
																					</span>
																				</label>
																				<select
																					{...register(
																						"location",
																					)}
																					className="select input-bordered w-full max-w-xs">
																					{divisions?.map(
																						(
																							division,
																						) => (
																							<option
																								key={
																									division._id
																								}
																								value={
																									division.division
																								}>
																								{
																									division.division
																								}
																							</option>
																						),
																					)}
																				</select>
																			</div>

																			<div className="form-control w-full max-w-xs">
																				<label className="label">
																					{" "}
																					<span className="label-text">
																						Photo
																					</span>
																				</label>
																				<input
																					placeholder={
																						user?.photoURL
																					}
																					type="file"
																					multiple
																					accept="image/*"
																					{...register(
																						"image",

																						!user?.photoURL &&
																							`{required: "Photo is Required",}`,
																					)}
																					className="input input-bordered w-full max-w-xs"
																				/>

																				{errors.img && (
																					<p className="text-red-500">
																						{
																							errors
																								.img
																								.message
																						}
																					</p>
																				)}
																			</div>
																			<div className="form-control w-full  max-w-xs">
																				<label className="label">
																					{" "}
																					<span className="label-text">
																						Please
																						Give
																						YOur
																						Opinion
																					</span>
																				</label>

																				<textarea
																					type="text"
																					{...register(
																						"description",
																						{
																							required:
																								"Name is Required",
																						},
																					)}
																					className="textarea input-bordered w-full h-36  max-w-xs"
																					placeholder="please give a description about the phone"></textarea>
																				{errors.name && (
																					<p className="text-red-500">
																						{
																							errors
																								.name
																								.message
																						}
																					</p>
																				)}
																			</div>
																		</div>

																		<div>
																			<input
																				className="btn btn-primary w-full  mt-4"
																				value="Add Your Commence"
																				type="submit"
																			/>
																		</div>
																	</form>
																</div>
															</div>
														</div>

														<div className="mt-4">
															<button
																type="button"
																className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
																onClick={
																	closeModal
																}>
																Got it, thanks!
															</button>
														</div>
													</Dialog.Panel>
												</Transition.Child>
											</div>
										</div>
									</Dialog>
								</Transition>
							</>
						</div>
						<div className="   items-center ">
							<Link to="/customarreviewsall">
								<button
									type="button"
									onClick={openModal}
									className="rounded-md btn btn-info btn-sm bg-opacity-75 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
									See Al Reviews
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{userscommences?.map((review) => (
					<Review key={review._id} review={review}></Review>
				))}
			</div>
		</section>
	);
};

export default CustomarReviews;
