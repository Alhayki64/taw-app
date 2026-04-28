import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.woff' },
    { src: '/fonts/Cairo-Bold.woff', fontWeight: 700 },
  ],
})

// Disable hyphenation so Arabic/English words don't get split
Font.registerHyphenationCallback(word => [word])
