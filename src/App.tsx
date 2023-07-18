import React, { useState } from 'react';
import './App.css';

const RESAS_BASEURL = "https://opendata.resas-portal.go.jp/"

const globalData = {
	0 : "青森県",
	1 : "新潟県",
};

export default function MyApp() {
	const [listOfPrefecture, setListOfPrefecture] = useState<Object | null>(globalData);

	const onChange = (e: any) => {
		console.log("Checked")
	}
	return (
		<div>
				{listOfPrefecture ? (
					Object.entries(listOfPrefecture).map(([key, value]) => (
						<div key={key}>
							<input
								id={key}
								type="checkbox"
								value={value}
								onChange={onChange}
							/>
							<label>{value}</label>

						</div>
					))
				) : (
					"Loading..."
				)}
				{}

		</div>
	)
}
