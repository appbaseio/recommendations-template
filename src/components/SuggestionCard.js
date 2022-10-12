/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from 'react';
import { string } from 'prop-types';
import strip from 'striptags';
import Truncate from 'react-truncate';
import { Card, Button, Icon } from 'antd';
import get from 'lodash.get';
import { CtaActions, getRecommendationsPreferences } from '../utils';
import { mediaMax } from '../utils/media';

const { Meta } = Card;

const cardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    max-width: 250px;
    height: 100%;
    .card-image-container {
        width: 250px;
        height: 250px;
        ${mediaMax.medium} {
            height: 100%;
            width: 100%;
        }
    }
    .product-button {
        top: -50%;
        position: absolute;
        background: ${primaryColor} !important;
        border: 0;
        box-shadow: 0 2px 4px ${titleColor}33;
        left: 50%;
        transform: translateX(-50%);
        transition: all ease 0.2s;
    }

    ::before {
        content: '';
        width: 100%;
        height: 0vh;
        background: ${primaryColor}00 !important;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        transition: all ease 0.4s;
    }

    .ant-card-cover {
        height: 250px;
        ${mediaMax.medium} {
            height: 200px;
        }
    }
    .ant-card-body {
        padding: 15px 10px;
    }
    ${mediaMax.small} {
        .ant-card-body {
            padding: 10px 5px;
        }
    }

    .ant-card-cover img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    .ant-card-meta-title {
        color: ${titleColor};
        white-space: unset;
    }

    .ant-card-meta-title h3 {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ant-card-meta-description {
        color: ${textColor};
        ${mediaMax.small} {
            font-size: 0.7rem;
        }
    }

    &:hover {
        .product-button {
            top: 50%;
        }
        ::before {
            width: 100%;
            height: 100%;
            background: ${primaryColor}1a !important;
        }
    }

    @media (max-width: 768px) {
        .ant-card-cover img {
            object-fit: cover;
        }
    }
`;

const cardTitleStyles = ({ titleColor, primaryColor }) => css`
    margin: 0;
    padding: 0;
    color: ${titleColor};
    ${mediaMax.small} {
        font-size: 0.9rem;
    }
    mark {
        color: ${titleColor};
        background-color: ${primaryColor}4d};
    }
`;

const SuggestionCard = ({
    isPreview,
    index,
    triggerAnalytics,
    clickId,
    handle,
    image,
    title,
    body_html,
    currency,
    variants,
    price,
    themeType,
    theme,
    className,
    ctaAction,
    ctaTitle,
    cardStyle,
    type,
    ...props
}) => {
    const [isFontLoaded, setFontLoad] = useState(false);
    useEffect(() => {
        document.fonts.ready.then(() => {
            setFontLoad(true);
        });
    }, []);

    const shouldShowCtaAction = ctaAction !== CtaActions.NO_BUTTON;
    const preferences = getRecommendationsPreferences();
    const redirectUrlText = get(
        preferences,
        'searchSettings.redirectUrlText',
        'View Product',
    );
    const redirectUrlIcon = get(
        preferences,
        'searchSettings.redirectUrlIcon',
        '',
    );
    let url = '';
    if (shouldShowCtaAction && handle && !isPreview) {
        if (type === 'similar') {
            url = `/products/${handle}`;
        } else {
            url = handle;
        }
    } else {
        url = undefined;
    }

    return (
        <div {...props}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => triggerAnalytics(clickId)} href={url}>
                <Card
                    hoverable
                    bordered={false}
                    css={cardStyles({
                        ...theme.colors,
                    })}
                    className={className || 'card'}
                    cover={
                        <div className="card-image-container">
                            {image && (
                                <img
                                    src={image}
                                    width="100%"
                                    alt={title}
                                    onError={(event) => {
                                        // eslint-disable-next-line
                                        event.target.src =
                                            'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
                                    }}
                                />
                            )}
                        </div>
                    }
                    style={{
                        padding: themeType === 'minimal' ? '10px' : 0,
                        ...cardStyle,
                    }}
                    bodyStyle={
                        themeType === 'minimal'
                            ? {
                                  padding: '15px 10px 10px',
                              }
                            : {}
                    }
                >
                    <Meta
                        title={
                            <h3
                                css={cardTitleStyles(theme.colors)}
                                style={
                                    themeType === 'minimal'
                                        ? {
                                              fontWeight: 600,
                                          }
                                        : {}
                                }
                            >
                                <Truncate lines={1} ellipsis={<span>...</span>}>
                                    {strip(title.toString())}
                                </Truncate>
                            </h3>
                        }
                        description={
                            <div style={{ height: 45 }}>
                                {body_html
                                    ? isFontLoaded &&
                                      themeType === 'classic' && (
                                          <Truncate
                                              lines={2}
                                              ellipsis={<span>...</span>}
                                          >
                                              {strip(body_html.toString())}
                                          </Truncate>
                                      )
                                    : undefined}
                            </div>
                        }
                    />
                    <div style={{ height: 25 }}>
                        {((variants && variants[0]) || price) && (
                            <div>
                                <h3
                                    style={{
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        marginTop: 6,
                                        color:
                                            themeType === 'minimal'
                                                ? theme.colors.textColor
                                                : theme.colors.titleColor,
                                    }}
                                >
                                    {currency}{' '}
                                    {variants && variants[0]
                                        ? variants[0].price
                                        : price}
                                </h3>
                            </div>
                        )}
                    </div>
                    {shouldShowCtaAction ? (
                        <Button
                            type="primary"
                            size="large"
                            className="product-button"
                        >
                            {redirectUrlIcon ? (
                                <img
                                    src={redirectUrlIcon}
                                    alt="redirect-url-icon"
                                    height="15px"
                                    width="15px"
                                    style={{
                                        marginRight: 5,
                                    }}
                                />
                            ) : (
                                <Icon type="eye" />
                            )}
                            {redirectUrlText || ctaTitle}
                        </Button>
                    ) : null}
                </Card>
            </a>
        </div>
    );
};

SuggestionCard.defaultProps = {
    type: 'other',
};
SuggestionCard.propTypes = {
    type: string,
};

export default SuggestionCard;
