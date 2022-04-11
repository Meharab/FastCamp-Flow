import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
// @ts-ignore
import { useNFT } from '@decentology/hyperverse-flow-nft';
import { useToken } from '@decentology/hyperverse-flow-token';
import { TribesData, useTribes } from '@decentology/hyperverse-flow-tribes';
import { useFlow } from '@decentology/hyperverse-flow';
import styles from '../styles/Home.module.css';
import Nav from '../components/Nav';
import Loader from '../components/Loader';
import { useCallback } from 'react';
import Image from 'next/image';

const TribesPage = () => {
	const router = useRouter();
	const tribes = useTribes();
	const [currentTribe, setCurrentTribe] = useState<TribesData>();
	const [isLoading, setIsLoading] = useState(false);
	const [loaderMessage, setLoaderMessage] = useState('Processing...');
	const flow = useFlow();

	const getMyTribe = useCallback(async () => {
		setIsLoading(true);
		setLoaderMessage('Processing...');
		if (flow?.user?.addr) {
			setCurrentTribe(await tribes?.getCurrentTribe(flow.user.addr));
		}
		setIsLoading(false);
	}, [flow?.user, setIsLoading, setLoaderMessage, setCurrentTribe, tribes]);

	const leaveMyTribe = useCallback(async () => {
		setIsLoading(true);
		setLoaderMessage('Leaving your tribe. Please wait.');
		await tribes?.leaveTribe();
		setIsLoading(false);
		router.push('/all-tribes');
	}, [router, setIsLoading, setLoaderMessage, tribes]);

	useEffect(() => {
		if (flow?.loggedIn) {
			getMyTribe();
		}
	}, [flow, getMyTribe]);

	const token = useToken();
	const [account, setAccount] = useState("0x686c97969a1b9e0b");
	const [balance, setBalance] = useState(null);

	const getBalanceFromModule = async () => {
		let balanceOfUser = await token.getBalance(account);
		console.log(balanceOfUser)
		setBalance(balanceOfUser);
	}

	const nft = useNFT();
	const [Account, SetAccount] = useState("0x686c97969a1b9e0b");
	const [Balance, SetBalance] = useState(null);

	const GetBalanceFromModule = async () => {
		let BalanceOfUser = await nft.getBalance(account);
		console.log(BalanceOfUser)
		SetBalance(BalanceOfUser);
	}


	return (
		<main>
			<Nav />
			{isLoading ? (
				<Loader loaderMessage="Processing..." />
			) : flow?.loggedIn && currentTribe ? (
				<div className={styles.container2}>
					<div className={styles.container3}>
						{currentTribe.ipfsHash === 'N/A' ? (
							<div className={styles.tribeCard}>
								<h2>{currentTribe.name}</h2>
							</div>
						) : (
							<Image
								height={600}
								width={480}
								src={`https://ipfs.infura.io/ipfs/${currentTribe.ipfsHash}/`}
								alt={currentTribe.name}
								className="tribe"
							/>
						)}

						<div>
							<h1 className={styles.text}>{currentTribe.name}</h1>
							<p className={styles.description}>{currentTribe.description}</p>
						</div>
					</div>

					<div>
						<h4>Get Balance of Your Reputation Point</h4>
						<p>This point will determine your position in DAO e.g. use this address for now '0x4a53d016f3435562'</p>
						<input
							placeholder="Account"
							onChange={(e) => setAccount(e.target.value)}
						/>

						<button className={styles.join} onClick={() => getBalanceFromModule()}>
							{!flow.user?.addr ? 'Connect Wallet' : 'Check Points'}
						</button>
						<p>{balance}</p>

						<h4>Get Balance of Your Special Reputation Point</h4>
						<p>This point will improve your position in DAO e.g. use this address for now '0x4a53d016f3435562'</p>
						<input
							placeholder="Account"
							onChange={(e) => SetAccount(e.target.value)}
						/>

						<button className={styles.join} onClick={() => GetBalanceFromModule()}>
							{!flow.user?.addr ? 'Connect Wallet' : 'Check Special Points'}
						</button>
						<p>{Balance}</p>
					</div>
					
					<button className={styles.join} onClick={() => leaveMyTribe()}>
						Leave the Guild
					</button>
				</div>
			) : (
				flow?.user &&
				flow.user.addr && (
					<div className={styles.container2}>
						<button className={styles.join} onClick={() => router.push('/all-tribes')}>
							Join a Guild
						</button>
					</div>
				)
			)}

			{!flow?.user || !flow.user.addr ? (
				<div className={styles.container2}>
					<p className={styles.error}>Connect Wallet to view your tribe</p>
				</div>
			) : null}
		</main>
	);
};

export default TribesPage;
