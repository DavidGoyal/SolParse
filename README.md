# SolParse Browser Extension

## Overview

The **SolParse** extension allows users to easily parse and view transaction details on the blockchain. By inputting a transaction ID, this extension will provide a detailed breakdown of the transaction, including:

- Token balance changes
- SOL balance changes
- Gas fees
- Recipient addresses
- And more!

This tool is ideal for users who want to quickly analyze transactions and understand the details of their blockchain activities.

## Features

- **Transaction ID Parsing**: Input a transaction ID, and the extension will fetch and display the details.
- **Token Balance Changes**: View how tokens were transferred between wallets in the transaction.
- **SOL Balance Changes**: See the SOL balance changes in the transaction.
- **Recipient Addresses**: Identify the recipient addresses involved in the transaction.
- **Gas Fees**: Understand the gas fees for the transaction.

## How to Use

1. **Fork the Repository Locally**:

   - Setup the **SolParse** repository locally on your machine.

2. **Install all the dependencies**:

   - Install all the dependencies using `npm install`.

3. **Create a env file**:

   - Create a `.env` file in the root directory of the project and add the following content:

   ```
   VITE_RPC_URL=your_rpc_url
   VITE_HELIUS_API_KEY=your_api_key
   ```

4. **Build the project**:

   - Run `npm run build` to build the project.

5. **Go to your browser and in extensions turn on developer mode and load the unpacked extension.**
   - Go to `chrome://extensions` in your browser.
   - Turn on developer mode.
   - Click on "Load unpacked" and select the `dist` folder in the project.

## FAQ

### How accurate is the transaction information?

The extension pulls live data directly from the blockchain, ensuring that the transaction details are up-to-date and accurate.

### Can I use the extension with any blockchain?

Currently, the extension supports transactions on the Solana blockchain. Support for other blockchains may be added in future versions.

### How do I get a transaction ID?

Transaction IDs can be obtained from your wallet after performing a transaction or from a blockchain explorer (such as Solscan for Solana transactions).

## Contributing

If you'd like to contribute to the development of the Transaction Parser, feel free to fork the repository and submit a pull request. Any contributions are welcome!

## License

This extension is open-source and available under the [MIT License](LICENSE).

---

For more information, please contact [Your Name] at [Your Email Address].
