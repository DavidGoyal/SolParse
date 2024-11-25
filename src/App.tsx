import { useEffect, useState } from "react";
import Transaction from "./Transaction";

const App = () => {
	const [transactionId, setTransactionId] = useState<string>("");
	const [txnpagevisible, setTxnpagevisible] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleParseTransaction = () => {
		if (!transactionId) {
			setError("Please enter a transaction hash");
			return;
		}
		setTxnpagevisible(true);
	};

	useEffect(() => {
		if (!error) return;
		setTimeout(() => {
			setError("");
		}, 5000);
	}, [error]);

	return (
		<div className="w-[300px] h-[400px] bg-black">
			{txnpagevisible ? (
				<Transaction
					transactionId={transactionId}
					setTxnpagevisible={setTxnpagevisible}
					setError={setError}
				/>
			) : (
				<div className="h-full w-full px-4 py-8 flex flex-col items-center justify-center gap-4">
					<h1 className="text-white text-xl font-bold">SolParse</h1>
					<p className="text-white text-center text-sm">
						Parse transactions from the blockchain and display them in a
						readable format.
					</p>
					<input
						type="text"
						className="bg-gray-800 text-white p-2 rounded-md w-full"
						placeholder="Enter a transaction hash"
						value={transactionId}
						onChange={(e) => setTransactionId(e.target.value)}
					/>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
						onClick={handleParseTransaction}
					>
						Parse Transaction
					</button>
					{error && (
						<p className="text-red-500 text-center break-words text-wrap max-w-full">
							{error}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default App;
