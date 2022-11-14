var insert_sol_query =
`INSERT INTO ihp_sol
([sliporder],
[date], 
[shift], 
[reception], 
[kamar], 
[status], 
[chtime], 
[chusr], 
[pos], 
[date_trans], 
[mobile_pos])
VALUES
('${kode_sol}'
,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
,'${shift}'
,'${rcp}'
,'${roomCode}'
,'1'
,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
'${chusr}'
,'${req._remoteAddress}'
,${date_trans_Query}
,'${android}')`;

var insert_sod_query = 
`INSERT INTO IHP_Sod
([SlipOrder],
[Inventory],
[Nama],
[Price],
[Qty],
[Total],
[Status],
[Location],
[Printed],
[Note],
[CHusr],
[Urut])
VALUES
('${kode_sol}',
'${arrOrderInv[a]}',
'${arrOrderInvName[a]}',
'${parseFloat(arrOrderPrice[a])}',
'${arrOrderQty[a]}',
'${parseFloat((arrOrderPrice[a] * arrOrderQty[a]))}',
'1',
'${arrOrderInvLocation[a]}',
'2',
'${arrOrderNotes[a]}',
'${chusr}',
${parseInt(a)})`;

var insert_sod_promo_query =`
INSERT INTO IHP_Sod_Promo " +
([SlipOrder],
[Inventory],
[Promo_Food],
[Harga_Promo]) " +
VALUES
('kode_sol + "'," +
" '" + arrOrderInv[a] + "'," +
" '" + nama_promo + "'," +
" '" + parseFloat((arrFinal_Potongan_Promo[a] * arrOrderQty[a])) + "')";