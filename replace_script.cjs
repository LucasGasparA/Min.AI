const fs = require('fs');
const files = [
  'tailwind.config.js',
  'src/pages/SelectMunicipality.jsx',
  'src/pages/ProposalEditor.jsx',
  'src/pages/Login.jsx',
  'src/pages/CreateProposal.jsx',
  'src/index.css',
  'src/components/Layout.jsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/veneza-/g, 'primary-');
  c = c.replace(/'veneza':/g, "'primary':");
  fs.writeFileSync(f, c);
});
console.log('Replaced successfully CJS');
