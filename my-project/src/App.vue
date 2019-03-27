<script>
import {get, showSuccess} from './utils/index.js'
import qcloud from 'wafer2-client-sdk'
import config from './config.js'
export default {
  async created () {

  }
}  
</script>
<style>
  .text-primary{
    color:#EA5149;
  }
  .text-footer{
    text-align: center;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .right{
    float: right;
  }
  .page-title{
    padding-left: 20px;
    background: #eee;
    line-height: 40px;
    font-size: 14px;
  }
  .btn{
    color: white;
    background-color: #ea5a49;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 2px;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    width: 100%;
    margin-bottom: 5px;
  }
  .btn:active{
    background-color: #fa5a49;
  }
</style>
