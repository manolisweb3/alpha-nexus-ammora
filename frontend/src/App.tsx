
import { useState } from 'react'
import {
  buildPortableCurve,
  type PortableCurveInput,
} from '@ammora-protocol/sdk'
import './App.css'

const economics: PortableCurveInput = {
  baseDecimals: 9,
  quoteDecimals: 6,
  totalSupplyRaw: 10_000_000_000_000n,
  saleAllocationRaw: 5_000_000_000_000n,
  lockedBaseRaw: 0n,
  start: {
    price: { numerator: 1000n, denominator: 1n },
  },
  graduation: {
    price: { numerator: 4000n, denominator: 1n },
  },
  migrationQuoteThreshold: {
    kind: 'exact',
    raw: 10_000_000_000_000n,
  },
  migrationQuoteFeeBps: 0n,
  migration: {
    kind: 'compounding',
    baseBudgetRaw: 3_000_000_000_000n,
    quoteBudgetRaw: 10_000_000_000_000n,
  },
  rounding: {
    sqrtPrice: 'floor',
    liquidity: 'floor',
    requiredAmounts: 'ceil',
    quoteThreshold: 'ceil',
    maxPriceErrorBps: 0n,
    maxSaleDustRaw: 0n,
  },
}

function App() {

const [tokenName, setTokenName] = useState('Alpha Nexus')
const [tokenSymbol, setTokenSymbol] = useState('ANX')
const [totalSupply, setTotalSupply] = useState('10000')

  const [output, setOutput] = useState(
    'Press the button to calculate a test curve.'
  )

const [curveResult, setCurveResult] =
  useState<ReturnType<typeof buildPortableCurve> | null>(null)


  function calculateCurve() {
    try {
      
if (!/^[1-9]\d*$/.test(totalSupply)) {
  throw new Error('Total Supply must be a positive whole number')
}

const supplyRaw = BigInt(totalSupply) * 10n ** BigInt(economics.baseDecimals)


const preview = buildPortableCurve({
  ...economics,
  totalSupplyRaw: supplyRaw,
  saleAllocationRaw: supplyRaw / 2n,
  migrationQuoteThreshold: {
    kind: 'exact',
    raw: 10_000_000_000_000n * BigInt(totalSupply) / 10_000n,
  },

migration: {
  ...economics.migration,
  baseBudgetRaw:
    economics.migration.baseBudgetRaw * BigInt(totalSupply) / 10_000n,
  quoteBudgetRaw:
    economics.migration.quoteBudgetRaw * BigInt(totalSupply) / 10_000n,
},
})



setCurveResult(preview)

      
      const json = JSON.stringify(
        preview,
        (_key, value) =>
          typeof value === 'bigint'
            ? value.toString()
            : value,
        2
      )
      setOutput(json)
    } catch (error) {
      setOutput(
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  return (
    <main style={{
      background: '#101827',
      color: 'white',
      padding: '36px',
      borderRadius: '20px',
      textAlign: 'left',
      maxWidth: '760px',
    }}>
      <h1>🚀 Alpha Nexus Launchpad</h1>
      <p>Powered by Ammora SDK</p>
      <p>Network: GIWA Sepolia Testnet</p>

      <hr />

<section style={{ display: 'grid', gap: '12px', marginBottom: '28px' }}>
  <h2>Token Details</h2>

  <label htmlFor="token-name">Token Name</label>
  <input
    id="token-name"
    type="text"
    value={tokenName}
    onChange={(e) => setTokenName(e.target.value)}
  />

  <label htmlFor="token-symbol">Token Symbol</label>
  <input
    id="token-symbol"
    type="text"
    value={tokenSymbol}
    onChange={(e) => setTokenSymbol(e.target.value)}
  />

  <label htmlFor="total-supply">Total Supply</label>
  <input
    id="total-supply"
    type="number"
    min="1"
    step="1"
    value={totalSupply}
    onChange={(e) => setTotalSupply(e.target.value)}
  />
</section>


      <h2>Bonding Curve Simulator</h2>
      <p>
        Preview synthetic token launch economics
        without sending blockchain transactions.
      </p>

      <button onClick={calculateCurve}>
        Calculate Curve
      </button>

<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginTop: '20px',
  }}
>
  {[
    { label: 'Token Name', value: tokenName },
    { label: 'Symbol', value: tokenSymbol },
    { label: 'Total Supply', value: totalSupply },
  ].map((item) => (
    <div
      key={item.label}
      style={{
        background: '#1d293b',
        border: '1px solid #566f9b',
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      <small>{item.label}</small>
      <h3>{item.value}</h3>
    </div>
  ))}
</div>

{curveResult && (
  
<div className="sdk-results-grid" style={{

    background: '#1d293b',
    border: '1px solid #566f9b',
    borderRadius: '12px',
    padding: '18px',
    marginTop: '20px'
  }}>
    <h3>SDK Calculation Results</h3>
    
<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Total Supply
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      curveResult.totalSupplyRaw /
      (10n ** BigInt(curveResult.metadata.baseDecimals))
    ).toLocaleString('en-US')} {tokenSymbol}
  </strong>
</p>




<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Tokens for Sale
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(curveResult.reconciliation.saleAllocationRaw / 1_000_000_000n).toLocaleString('en-US')} ANX
  </strong>
</p>


<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Sale Allocation
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      (curveResult.reconciliation.saleAllocationRaw * 100n) /
      curveResult.totalSupplyRaw
    ).toString()}%
  </strong>
</p>



<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Starting Price (quote per token)
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      (Number(curveResult.startSqrtPrice) / 2 ** 64) ** 2 *
      10 ** (economics.baseDecimals - economics.quoteDecimals)
    ).toLocaleString('en-US', { maximumFractionDigits: 6 })}
  </strong>
</p>



<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Graduation Price (quote per token)
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      (Number(curveResult.migrationSqrtPrice) / 2 ** 64) ** 2 *
      10 ** (economics.baseDecimals - economics.quoteDecimals)
    ).toLocaleString('en-US', { maximumFractionDigits: 6 })}
  </strong>
</p>



<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Net Migration Base (ANX)
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      Number(curveResult.reconciliation.netMigrationBaseRaw) /
      10 ** curveResult.metadata.baseDecimals
    ).toLocaleString('en-US', { maximumFractionDigits: 6 })} ANX
  </strong>
</p>



<p>
  <span style={{ display: 'block', fontSize: '13px', opacity: 0.8 }}>
    Net Migration Quote
  </span>
  <strong style={{ display: 'block', fontSize: '26px', marginTop: '8px' }}>
    {(
      Number(curveResult.reconciliation.netMigrationQuoteRaw) /
      10 ** curveResult.metadata.quoteDecimals
    ).toLocaleString('en-US', { maximumFractionDigits: 6 })}
  </strong>
  <small style={{ opacity: 0.7 }}>quote units</small>
</p>


  </div>
)}

<details style={{ marginTop: '20px' }}>
  <summary style={{ cursor: 'pointer' }}>
    Show SDK Results
  </summary>
  <pre style={{
    background: '#1d293b',
    padding: '18px',
    borderRadius: '12px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  }}>
    {output}
  </pre>
</details>

    </main>
  )
}

export default App
