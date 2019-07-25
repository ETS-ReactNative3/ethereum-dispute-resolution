// importing instance from file, not constructor from library
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xd7be071eFfCcB7A56F14E094a4709dC72e502f3a'
);

export default instance;