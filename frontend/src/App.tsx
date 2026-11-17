
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
    </main>
  )
}

export default App
