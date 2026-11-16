
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
  const [output, setOutput] = useState(
    'Press the button to calculate a test curve.'
  )

  function calculateCurve() {
    try {
      const preview = buildPortableCurve(economics)
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
