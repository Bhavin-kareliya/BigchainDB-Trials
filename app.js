const driver = require('bigchaindb-driver')
//const { Ed25519Sha256 } = require('crypto-conditions');

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new driver.Connection(API_PATH)

//For Generate new key pair
//const KEY_NAME = new driver.Ed25519Keypair()

const john = {
    publicKey: '7sibuyVJpg7bKovn41JmDamPpHHJnraNztGChFaqfc3D',
    privateKey: '********************************************'
}
const bob = {
    publicKey: '4iLU594Lnf54vyFyWLEogHG1F4nCDPhqGacj8c1LFGty',
    privateKey: '********************************************'
}
const segment = {
    name: "Package-1",
    author: "bob",
    place: "India",
    year: "2021",
}

const transactionId = "99bc4d73ca8342c1fa54f31ed42a364bec074e715e961f77e1b6c5cb1de9487b";
const transactionId2 = "067a5fd719e75cd3c1338c244cdd6c230394d8abee0cbd72ed7bccd60b15f493";
const assetId = "067a5fd719e75cd3c1338c244cdd6c230394d8abee0cbd72ed7bccd60b15f493";

//Functions
//makeTransaction(segment)
//transferOwnership(transactionId, john)
listTransactions(assetId)

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
                driver.Transaction.makeEd25519Condition(bob.publicKey))
        ],
        bob.publicKey
    )
    const txSigned = driver.Transaction.signTransaction(tx, bob.privateKey)
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
            const signedTransfer = driver.Transaction.signTransaction(createTranfer, bob.privateKey)
            return conn.postTransactionCommit(signedTransfer)
        })
        .then(res => { console.log('Transaction ownership successfully posted by hash ', res.id) })
        .catch(err => { console.error(err) })
}

function listTransactions(assetId) {
    conn.listTransactions(assetId)
        .then(res => console.log(res))
        .catch(err => console.error(error))
}