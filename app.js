const driver = require('bigchaindb-driver')
const { Ed25519Sha256 } = require('crypto-conditions');

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new driver.Connection(API_PATH)

//For Generate new key pair
//const KEY_NAME = new driver.Ed25519Keypair()

const jekin = {
    publicKey: '********************************************',
    privateKey: '********************************************'
}
const bhavin = {
    publicKey: '********************************************',
    privateKey: '********************************************'
}
const segment = {
    name: "Package-1",
    author: "Jekin-Gohel",
    place: "India",
    year: "2021",
}

const transactionId = "99bc4d73ca8342c1fa54f31ed42a364bec074e715e961f77e1b6c5cb1de9487b";

//Functions
//makeTransaction(segment)
//transferOwnership(transactionId, jekin)
listTransactions("d26218937a16aa6d11e9eb7644536dc82af2cac1bfedeaa81d89359ba52183fc")

function makeTransaction(payload) {
    const tx = driver.Transaction.makeCreateTransaction(
        payload,
        {
            datetime: new Date().toString(),
            location: "India",
            value: {
                value_usd: "2000",
                value_inr: "149987",
            },
        },
        [
            driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(jekin.publicKey))
        ],
        jekin.publicKey
    )
    const txSigned = driver.Transaction.signTransaction(tx, jekin.privateKey)
    const conn = new driver.Connection(API_PATH)
    conn.postTransactionCommit(txSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        .catch(err => { console.log(err); })
}

function transferOwnership(transacctionId, newOwner) {
    conn.getTransaction(transacctionId)
        .then((txCreated) => {
            console.log(txCreated);
            const createTranfer = driver.Transaction.
                makeTransferTransaction(
                    [{
                        tx: txCreated,
                        output_index: 0
                    }],
                    [
                        driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(newOwner.publicKey))
                    ],
                    {
                        datetime: new Date().toString(),
                        location: "India",
                        value: {
                            value_usd: "2",
                            value_inr: "74.99*value_usd",
                        },
                    },
                )
            const signedTransfer = driver.Transaction.signTransaction(createTranfer, jekin.privateKey)
            return conn.postTransactionCommit(signedTransfer)
        })
        .then(res => {
            console.log('Transaction', res.id, 'successfully posted.')
        })
        .catch(err => {
            console.error(err)
        })
}

function listTransactions(publicId) {
    conn.listTransactions(publicId).then(res => console.log(res))
}