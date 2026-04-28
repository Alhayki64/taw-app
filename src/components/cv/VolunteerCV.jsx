import React from 'react'
import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer'
import QRCode from 'qrcode'
// Side-effect: registers Cairo font before any document renders
import '@/lib/pdfFonts'

// ─── Brand tokens ────────────────────────────────────────────────────────────
const G   = '#2D5A3D'   // taw-green
const BG  = '#F5F2EC'   // taw-beige
const GLD = '#C9A961'   // taw-gold
const LT  = '#E8F0EB'   // light green tint
const D   = '#1A2E24'   // dark text
const M   = '#4A6558'   // mid text
const DIM = '#8BA99A'   // dim text
const W   = '#FFFFFF'

const s = StyleSheet.create({
  page: { fontFamily: 'Cairo', fontSize: 9, backgroundColor: W, padding: 0 },

  // Header
  header: {
    backgroundColor: G, padding: '18 28',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  hLogo:  { fontSize: 15, fontWeight: 700, color: W, letterSpacing: 1 },
  hTitle: { fontSize: 10, color: '#B8D4C4', fontWeight: 700 },
  hDate:  { fontSize: 7.5, color: '#B8D4C4', textAlign: 'right' },

  // Body
  body: { padding: '22 28', flex: 1 },

  name:  { fontSize: 19, fontWeight: 700, color: D, marginBottom: 5 },
  tier:  {
    backgroundColor: GLD, color: G, fontSize: 7.5, fontWeight: 700,
    paddingTop: 3, paddingBottom: 3, paddingLeft: 9, paddingRight: 9,
    borderRadius: 4, alignSelf: 'flex-start', marginBottom: 14,
  },

  statsRow: { flexDirection: 'row', marginBottom: 18 },
  stat: {
    flex: 1, borderLeftWidth: 2, borderLeftColor: G,
    paddingLeft: 10, paddingRight: 8,
  },
  statVal:   { fontSize: 15, fontWeight: 700, color: G },
  statLabel: { fontSize: 6.5, color: M, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },

  sectionTitle: {
    fontSize: 9.5, fontWeight: 700, color: D, marginBottom: 7,
    paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: LT,
  },

  // Table
  tHead: {
    flexDirection: 'row', backgroundColor: LT,
    paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
    borderRadius: 3, marginBottom: 2,
  },
  tRow: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: '#EEF2F0',
    paddingTop: 4, paddingBottom: 4, paddingLeft: 5, paddingRight: 5,
  },
  tRowAlt: { backgroundColor: '#F9FBFA' },
  th: { fontSize: 6.5, fontWeight: 700, color: M, textTransform: 'uppercase', letterSpacing: 0.3 },
  td: { fontSize: 7.5, color: D },

  cDate:  { flex: 1.4 },
  cOrg:   { flex: 2.2 },
  cEvent: { flex: 2.5 },
  cCat:   { flex: 1.2 },
  cHrs:   { flex: 0.65 },
  cPts:   { flex: 0.65 },
  cRef:   { flex: 1.3 },

  empty: { fontSize: 9, color: DIM, textAlign: 'center', padding: 20 },

  // Footer
  footer: {
    backgroundColor: BG, padding: '13 28',
    flexDirection: 'row', alignItems: 'center',
  },
  fQr:      { width: 60, height: 60, marginRight: 14 },
  fText:    { flex: 1 },
  fVerified:{ fontSize: 8.5, fontWeight: 700, color: G, marginBottom: 3 },
  fUrl:     { fontSize: 7, color: M, marginBottom: 2 },
  fToken:   { fontSize: 6, color: DIM },
  fBrand:   { fontSize: 9.5, fontWeight: 700, color: G, letterSpacing: 0.8 },
})

function fmt(iso) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('en-BH', { year: 'numeric', month: 'short', day: 'numeric' })
}

export async function buildCVDocument({ profile, sessions, totals, verifyUrl, verificationToken, generatedAt }) {
  const qr = await QRCode.toDataURL(verifyUrl, {
    margin: 1, width: 180,
    color: { dark: G, light: BG },
  })

  return (
    <Document title={`Tawwa CV – ${profile.display_name}`} author="Tawwa">
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.hLogo}>TAWWA · طوّع</Text>
          <Text style={s.hTitle}>Volunteer Record / سجل التطوع</Text>
          <Text style={s.hDate}>{fmt(generatedAt)}</Text>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>

          <Text style={s.name}>{profile.display_name}</Text>
          <Text style={s.tier}>{totals.tier} Volunteer</Text>

          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statVal}>{Number(totals.hours).toFixed(1)}</Text>
              <Text style={s.statLabel}>Hours</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statVal}>{totals.sessions}</Text>
              <Text style={s.statLabel}>Sessions</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statVal}>{totals.points.toLocaleString()}</Text>
              <Text style={s.statLabel}>Points</Text>
            </View>
          </View>

          <Text style={s.sectionTitle}>Confirmed Volunteer Sessions</Text>

          {sessions.length === 0 ? (
            <Text style={s.empty}>No confirmed sessions recorded.</Text>
          ) : (
            <>
              <View style={s.tHead}>
                <Text style={[s.th, s.cDate]}>Date</Text>
                <Text style={[s.th, s.cOrg]}>Organisation</Text>
                <Text style={[s.th, s.cEvent]}>Event / Opportunity</Text>
                <Text style={[s.th, s.cCat]}>Category</Text>
                <Text style={[s.th, s.cHrs]}>Hrs</Text>
                <Text style={[s.th, s.cPts]}>Pts</Text>
                <Text style={[s.th, s.cRef]}>Ref</Text>
              </View>
              {sessions.map((row, i) => (
                <View key={i} style={[s.tRow, i % 2 === 1 ? s.tRowAlt : null]}>
                  <Text style={[s.td, s.cDate]}>{fmt(row.date)}</Text>
                  <Text style={[s.td, s.cOrg]}>{row.org || '–'}</Text>
                  <Text style={[s.td, s.cEvent]}>{row.event || '–'}</Text>
                  <Text style={[s.td, s.cCat]}>{row.category || '–'}</Text>
                  <Text style={[s.td, s.cHrs]}>{row.hours ?? 0}</Text>
                  <Text style={[s.td, s.cPts]}>{row.points ?? 0}</Text>
                  <Text style={[s.td, s.cRef]}>{row.ref}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Image src={qr} style={s.fQr} />
          <View style={s.fText}>
            <Text style={s.fVerified}>Verified by Tawwa — Scan to confirm authenticity</Text>
            <Text style={s.fUrl}>{verifyUrl}</Text>
            <Text style={s.fToken}>Token: {verificationToken}</Text>
          </View>
          <Text style={s.fBrand}>tawwa.online</Text>
        </View>

      </Page>
    </Document>
  )
}
