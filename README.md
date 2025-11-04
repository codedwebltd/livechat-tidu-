// Get the entire wallet object
const wallet = authService.getUserData('wallet');
console.log(wallet);  // Shows the entire wallet object

// Get specific wallet properties
const balance = authService.getUserData('wallet.balance');  // "0.00"
const currency = authService.getUserData('wallet.currency');  // "USD"
const isActive = authService.getUserData('wallet.is_active');  // true

// Use in your components
function WalletInfo() {
  const balance = authService.getUserData('wallet.balance');
  const currency = authService.getUserData('wallet.currency');
  
  return (
    <div className="wallet-info">
      <h3>Your Balance</h3>
      <p className="balance">{currency} {balance}</p>
    </div>
  );
}