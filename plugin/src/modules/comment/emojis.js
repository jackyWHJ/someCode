const getImage = (url) => {
    return require(`zn-image/emoji/${url}`);
}

const emojisArr = [
        {
            id: '0001',
            url: '0001@2x.png',
            str: '[笑]'
        },
        {
            id: '0002',
            url: '0002@2x.png',
            str: '[呲牙]'
        },
        {
            id: '0003',
            url: '0003@2x.png',
            str: '[色咪咪]'
        },
        {
            id: '0004',
            url: '0004@2x.png',
            str: '[大笑]'
        },
        {
            id: '0005',
            url: '0005@2x.png',
            str: '[馋]'
        },
        {
            id: '0006',
            url: '0006@2x.png',
            str: '[发呆]'
        },
        {
            id: '0007',
            url: '0007@2x.png',
            str: '[惊恐]'
        },
        {
            id: '0008',
            url: '0008@2x.png',
            str: '[可怜]'
        },
        {
            id: '0009',
            url: '0009@2x.png',
            str: '[流泪]'
        },
        {
            id: '0010',
            url: '0010@2x.png',
            str: '[吐]'
        },
        {
            id: '0011',
            url: '0011@2x.png',
            str: '[别理我]'
        },
        {
            id: '0012',
            url: '0012@2x.png',
            str: '[受伤]'
        },
        {
            id: '0013',
            url: '0013@2x.png',
            str: '[晕了]'
        },
        {
            id: '0014',
            url: '0014@2x.png',
            str: '[狰狞]'
        },
        {
            id: '0015',
            url: '0015@2x.png',
            str: '[阴笑]'
        },
        {
            id: '0016',
            url: '0016@2x.png',
            str: '[失落]'
        },
        {
            id: '0017',
            url: '0017@2x.png',
            str: '[嘻嘻]'
        },
        {
            id: '0018',
            url: '0018@2x.png',
            str: '[哈哈]'
        },
        {
            id: '0019',
            url: '0019@2x.png',
            str: '[喜欢]'
        },
        {
            id: '0020',
            url: '0020@2x.png',
            str: '[晕]'
        },
        {
            id: '0021',
            url: '0021@2x.png',
            str: '[泪]'
        },
        {
            id: '0022',
            url: '0022@2x.png',
            str: '[馋嘴]'
        },
        {
            id: '0023',
            url: '0023@2x.png',
            str: '[抓狂]'
        },
        {
            id: '0024',
            url: '0024@2x.png',
            str: '[哼]'
        },
        {
            id: '0025',
            url: '0025@2x.png',
            str: '[可爱]'
        },
        {
            id: '0026',
            url: '0026@2x.png',
            str: '[怒]'
        },
        {
            id: '0027',
            url: '0027@2x.png',
            str: '[汗]'
        },
        {
            id: '0028',
            url: '0028@2x.png',
            str: '[微笑]'
        },
        {
            id: '0029',
            url: '0029@2x.png',
            str: '[睡觉]'
        },
        {
            id: '0030',
            url: '0030@2x.png',
            str: '[钱]'
        },
        {
            id: '0031',
            url: '0031@2x.png',
            str: '[偷笑]'
        },
        {
            id: '0032',
            url: '0032@2x.png',
            str: '[酷]'
        },
        {
            id: '0033',
            url: '0033@2x.png',
            str: '[衰]'
        },
        {
            id: '0034',
            url: '0034@2x.png',
            str: '[吃惊]'
        },
        {
            id: '0035',
            url: '0035@2x.png',
            str: '[怒骂]'
        },
        {
            id: '0036',
            url: '0036@2x.png',
            str: '[鄙视]'
        },
        {
            id: '0037',
            url: '0037@2x.png',
            str: '[挖鼻屎]'
        },
        {
            id: '0038',
            url: '0038@2x.png',
            str: '[色]'
        },
        {
            id: '0039',
            url: '0039@2x.png',
            str: '[鼓掌]'
        },
        {
            id: '0040',
            url: '0040@2x.png',
            str: '[悲伤]'
        },
        {
            id: '0041',
            url: '0041@2x.png',
            str: '[思考]'
        },
        {
            id: '0042',
            url: '0042@2x.png',
            str: '[生病]'
        },
        {
            id: '0043',
            url: '0043@2x.png',
            str: '[亲亲]'
        },
        {
            id: '0044',
            url: '0044@2x.png',
            str: '[抱抱]'
        },
        {
            id: '0045',
            url: '0045@2x.png',
            str: '[白眼]'
        },
        {
            id: '0046',
            url: '0046@2x.png',
            str: '[右哼哼]'
        },
        {
            id: '0047',
            url: '0047@2x.png',
            str: '[左哼哼]'
        },
        {
            id: '0048',
            url: '0048@2x.png',
            str: '[嘘]'
        },
        {
            id: '0049',
            url: '0049@2x.png',
            str: '[委屈]'
        },
        {
            id: '0050',
            url: '0050@2x.png',
            str: '[哈欠]'
        },
        {
            id: '0051',
            url: '0051@2x.png',
            str: '[敲打]'
        },
        {
            id: '0052',
            url: '0052@2x.png',
            str: '[疑问]'
        },
        {
            id: '0053',
            url: '0053@2x.png',
            str: '[挤眼]'
        },
        {
            id: '0054',
            url: '0054@2x.png',
            str: '[害羞]'
        },
        {
            id: '0055',
            url: '0055@2x.png',
            str: '[快哭了]'
        },
        {
            id: '0056',
            url: '0056@2x.png',
            str: '[拜拜]'
        },
        {
            id: '0057',
            url: '0057@2x.png',
            str: '[黑线]'
        },
        {
            id: '0058',
            url: '0058@2x.png',
            str: '[强]'
        },
        {
            id: '0059',
            url: '0059@2x.png',
            str: '[弱]'
        },
        {
            id: '0060',
            url: '0060@2x.png',
            str: '[给力]'
        },
        {
            id: '0061',
            url: '0061@2x.png',
            str: '[浮云]'
        },
        {
            id: '0062',
            url: '0062@2x.png',
            str: '[围观]'
        },
        {
            id: '0063',
            url: '0063@2x.png',
            str: '[威武]'
        },
        {
            id: '0064',
            url: '0064@2x.png',
            str: '[相机]'
        },
        {
            id: '0065',
            url: '0065@2x.png',
            str: '[汽车]'
        },
        {
            id: '0066',
            url: '0066@2x.png',
            str: '[飞机]'
        },
        {
            id: '0067',
            url: '0067@2x.png',
            str: '[奥特曼]'
        },
        {
            id: '0068',
            url: '0068@2x.png',
            str: '[爱心]'
        },
        {
            id: '0069',
            url: '0069@2x.png',
            str: '[兔子]'
        },
        {
            id: '0070',
            url: '0070@2x.png',
            str: '[熊猫]'
        },
        {
            id: '0071',
            url: '0071@2x.png',
            str: '[不要]'
        },
        {
            id: '0072',
            url: '0072@2x.png',
            str: '[ok]'
        },
        {
            id: '0073',
            url: '0073@2x.png',
            str: '[赞]'
        },
        {
            id: '0074',
            url: '0074@2x.png',
            str: '[勾引]'
        },
        {
            id: '0075',
            url: '0075@2x.png',
            str: '[耶]'
        },
        {
            id: '0076',
            url: '0076@2x.png',
            str: '[爱你]'
        },
        {
            id: '0077',
            url: '0077@2x.png',
            str: '[拳头]'
        },
        {
            id: '0078',
            url: '0078@2x.png',
            str: '[差劲]'
        },
        {
            id: '0079',
            url: '0079@2x.png',
            str: '[握手]'
        },
        {
            id: '0080',
            url: '0080@2x.png',
            str: '[玫瑰]'
        },
        {
            id: '0081',
            url: '0081@2x.png',
            str: '[心]'
        },
        {
            id: '0082',
            url: '0082@2x.png',
            str: '[伤心]'
        },
        {
            id: '0083',
            url: '0083@2x.png',
            str: '[猪头]'
        },
        {
            id: '0084',
            url: '0084@2x.png',
            str: '[咖啡]'
        },
        {
            id: '0085',
            url: '0085@2x.png',
            str: '[麦克风]'
        },
        {
            id: '0086',
            url: '0086@2x.png',
            str: '[月亮]'
        },
        {
            id: '0087',
            url: '0087@2x.png',
            str: '[太阳]'
        },
        {
            id: '0088',
            url: '0088@2x.png',
            str: '[啤酒]'
        },
        {
            id: '0089',
            url: '0089@2x.png',
            str: '[萌]'
        },
        {
            id: '0090',
            url: '0090@2x.png',
            str: '[礼物]'
        },
        {
            id: '0091',
            url: '0091@2x.png',
            str: '[互粉]'
        },
        {
            id: '0092',
            url: '0092@2x.png',
            str: '[钟]'
        },
        {
            id: '0093',
            url: '0093@2x.png',
            str: '[自行车]'
        },
        {
            id: '0094',
            url: '0094@2x.png',
            str: '[蛋糕]'
        },
        {
            id: '0095',
            url: '0095@2x.png',
            str: '[围巾]'
        },
        {
            id: '0096',
            url: '0096@2x.png',
            str: '[手套]'
        },
        {
            id: '0097',
            url: '0097@2x.png',
            str: '[雪花]'
        },
        {
            id: '0098',
            url: '0098@2x.png',
            str: '[雪人]'
        },
        {
            id: '0099',
            url: '0099@2x.png',
            str: '[帽子]'
        },
        {
            id: '0100',
            url: '0100@2x.png',
            str: '[树叶]'
        },
        {
            id: '0101',
            url: '0101@2x.png',
            str: '[足球]'
        }
    ];

export const getEmoji = (str) => {
    const len = emojis.length;
    for (let i = 0; i < len; i++) {
        if (str == emojis[i].str) {
            return emojis[i].url;
        }
    }

    return str;
};

export const emojis = emojisArr.map(item => {
    item.url = getImage(item.url);
    return item;
});