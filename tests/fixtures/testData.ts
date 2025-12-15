export const testUsers = {
  validUser: {
    username: 'testuser123',
    email: 'testuser@example.com',
    password: 'SecurePass123!',
    role: 'user'
  },
  
  adminUser: {
    username: 'adminuser',
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'admin'
  },
  
  invalidUser: {
    username: '',
    email: 'invalid-email',
    password: '123',
    role: 'invalid'
  }
};

export const testWallets = {
  validWallet: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    privateKey: 'test_private_key_do_not_use_in_production',
  },
  
  zeroAddress: '0x0000000000000000000000000000000000000000',
};

export const testTokens = {
  realToken: {
    address: '0x1234567890123456789012345678901234567890',
    name: 'RealT-S-9943-Marlowe-St-Detroit-MI',
    symbol: 'REALTOKEN',
    decimals: 18
  },
  
  usdc: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6
  }
};

export const testOffers = {
  validOffer: {
    offerToken: '0x1234567890123456789012345678901234567890',
    buyerToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    buyer: '0x0000000000000000000000000000000000000000', // Public offer
    price: '50.00',
    amount: '100'
  },
  
  privateOffer: {
    offerToken: '0x1234567890123456789012345678901234567890',
    buyerToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    buyer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', // Specific buyer
    price: '52.50',
    amount: '50'
  }
};

export const injectionPayloads = {
  sql: "' OR '1'='1",
  noSql: { '$ne': null },
  xss: '<script>alert("XSS")</script>',
  commandInjection: '; rm -rf /',
  ldap: '*)(uid=*))(|(uid=*',
  xml: '<?xml version="1.0"?><!DOCTYPE foo>',
  pathTraversal: '../../../etc/passwd'
};

export const edgeCaseInputs = {
  whitespaceOnly: '   ',
};

export const apiHeaders = {
  json: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  withAuth: (token: string) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-auth-token': token
  })
};

export const expectedErrors = {
  unauthorized: {
    status: 401,
    message: /authorization denied|not valid/i
  },
  
  badRequest: {
    status: 400,
    message: /required|invalid/i
  },
  
  notFound: {
    status: 404,
    message: /not found/i
  },
  
  serverError: {
    status: 500,
    message: /internal server error/i
  }
};
