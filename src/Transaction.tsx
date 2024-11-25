import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import dayjs from "dayjs";

type TokenBalanceChange = {
	tokenMint: string;
	amount: number;
	fromUserAccount: string;
	toUserAccount: string;
};

type TokenTransfer = {
	mint: string;
	tokenAmount: number;
	fromUserAccount: string;
	toUserAccount: string;
	fromTokenAccount: string;
	toTokenAccount: string;
};

type SolTransfer = {
	fromUserAccount: string;
	toUserAccount: string;
	amount: number;
};

const Transaction = ({
	transactionId,
	setTxnpagevisible,
	setError,
}: {
	transactionId: string;
	setTxnpagevisible: React.Dispatch<React.SetStateAction<boolean>>;
	setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [tokenBalanceChanges, setTokenBalanceChanges] = useState<
		TokenBalanceChange[]
	>([]);
	const [gas, setGas] = useState<number>();
	const [gasPayer, setGasPayer] = useState<string>();
	const [solTransfer, setSolTransfer] = useState<SolTransfer[]>([]);
	const [timeAgo, setTimeAgo] = useState<string>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchTransaction = async () => {
			if (!transactionId) return;

			try {
				const response = await fetch(
					`https://api.helius.xyz/v0/transactions?api-key=${
						import.meta.env.VITE_HELIUS_API_KEY
					}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							transactions: [transactionId],
						}),
					}
				);

				const data = await response.json();
				const json = data[0];

				const blockTime = json.timestamp;
				const currentTime = Math.floor(Date.now() / 1000);
				const timeAgo = currentTime - blockTime;
				const date = dayjs().subtract(timeAgo, "second");
				const formattedDate = date.format("DD-MM-YYYY HH:mm:ss");

				setTimeAgo(formattedDate.toString());

				setGasPayer(json.feePayer);
				setGas(json.fee / LAMPORTS_PER_SOL);

				setSolTransfer(() => {
					const solTransfer: SolTransfer[] = [];
					if (json.nativeTransfers.length > 0) {
						json.nativeTransfers.forEach((transfer: SolTransfer) => {
							solTransfer.push({
								fromUserAccount: transfer.fromUserAccount,
								toUserAccount: transfer.toUserAccount,
								amount: transfer.amount / LAMPORTS_PER_SOL,
							});
						});
					}
					return solTransfer;
				});

				const primaryTransfers = json.tokenTransfers.filter(
					(transfer: TokenTransfer) => {
						const isGasTransfer =
							transfer.mint === "So11111111111111111111111111111111111111112";
						const isSelfTransfer =
							transfer.fromUserAccount === transfer.toUserAccount;

						// Keep transfers involving distinct accounts
						return (
							!isGasTransfer && !isSelfTransfer && transfer.tokenAmount > 0 // Allow all amounts > 0
						);
					}
				);

				setTokenBalanceChanges(() => {
					const tokenBalanceChanges: TokenBalanceChange[] = [];
					if (primaryTransfers.length > 0) {
						primaryTransfers.forEach((transfer: TokenTransfer) => {
							tokenBalanceChanges.push({
								tokenMint: transfer.mint,
								amount: transfer.tokenAmount,
								fromUserAccount: transfer.fromUserAccount,
								toUserAccount: transfer.toUserAccount,
							});
						});
					}
					return tokenBalanceChanges;
				});
			} catch (error) {
				console.log(error);
				setTxnpagevisible(false);
				setError(
					"Oops! We cannot process your transaction at this moment. Please try again later."
				);
			} finally {
				setLoading(false);
			}
		};
		fetchTransaction();
	}, [transactionId, setError, setTxnpagevisible]);

	return loading ? (
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
		</div>
	) : (
		<div className="h-full w-full gap-8 p-4 flex flex-col justify-center">
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[20%]"
				onClick={() => setTxnpagevisible(false)}
			>
				←
			</button>
			<div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
				<div className="flex flex-col gap-2">
					<h2 className="text-white text-xl font-bold">Transaction Details</h2>
					<div className="flex gap-2">
						<p className="text-white text-sm">Gas:</p>
						<p className="text-white text-sm">{gas} SOL</p>
					</div>
					<CopyInput value={gasPayer!} type="Gas Payer" />
					<div className="flex gap-2">
						<p className="text-white text-sm">Transaction Date:</p>
						<p className="text-white text-sm">{timeAgo?.split(" ")[0]}</p>
					</div>
					<div className="flex gap-2">
						<p className="text-white text-sm">Transaction Time:</p>
						<p className="text-white text-sm">{timeAgo?.split(" ")[1]}</p>
					</div>
				</div>

				{solTransfer.length > 0 && (
					<>
						<h2 className="text-white text-xl font-bold">
							Solana Balance Changes
						</h2>
						<div className="flex flex-col gap-3">
							{solTransfer.map((solChange, index) => (
								<div className="flex gap-2" key={index}>
									<p className="text-white text-sm">{index + 1}.</p>
									<div className="flex flex-col gap-2">
										<CopyInput
											value={solChange.fromUserAccount!}
											type="Sender"
										/>
										<CopyInput
											value={solChange.toUserAccount!}
											type="Receiver"
										/>
										<p className="text-white text-sm">
											Amount: {solChange.amount}
										</p>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{tokenBalanceChanges.length > 0 && (
					<>
						<h2 className="text-white text-xl font-bold">
							Token Balance Changes
						</h2>
						<div className="flex flex-col gap-3">
							{tokenBalanceChanges.map((tokenBalanceChange, index) => (
								<div className="flex gap-2" key={index}>
									<p className="text-white text-sm">{index + 1}.</p>
									<div className="flex flex-col gap-2">
										<CopyInput
											value={tokenBalanceChange.tokenMint!}
											type="Token Mint"
										/>
										<CopyInput
											value={tokenBalanceChange.fromUserAccount!}
											type="Sender"
										/>
										<CopyInput
											value={tokenBalanceChange.toUserAccount!}
											type="Receiver"
										/>
										<p className="text-white text-sm">
											Amount: {tokenBalanceChange.amount}
										</p>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Transaction;

function CopyInput({
	value,
	type,
}: {
	value: string;
	type: "Sender" | "Receiver" | "Token Mint" | "Gas Payer";
}) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = (text: string) => {
		setCopied(true);
		navigator.clipboard.writeText(text);
	};

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 10000);
		}
	}, [copied]);

	return (
		<div className="flex items-center space-x-4">
			<div className="flex gap-2">
				<p className="text-white text-sm">{type}:</p>
				<p className="text-white text-sm">
					{value?.slice(0, 5) + "..." + value?.slice(-5)}
				</p>
			</div>
			<span
				className="text-white cursor-pointer"
				onClick={() => copyToClipboard(value!)}
			>
				{!copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						className="lucide lucide-clipboard"
					>
						<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
						<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						className="lucide lucide-check"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				)}
			</span>
		</div>
	);
}
