from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from selenium.webdriver.chrome.options import Options

generate_btn = '#app > div > div > div.generator.trending.mint-card > div.generator-actions > button'

from time import sleep

from fake_useragent import UserAgent

MODELS = ["3 Guofeng3 V3.4","Absolute Reality V1.6","Absolute Reality V1.8.1","Am I Real V4.1","Analog V1","Anything V3","Anything V4.5","Anything V5","AbyssOrangeMix V3","Blazing Drive V10g","CetusMix Version35", "Counterfeit V3.0","CuteYukimix MidChapter3","CyberRealistic V3.3","Dalcefo V4","Deliberate V2","Deliberate V3","Dreamlike Anime V1","Dreamlike Diffusion V1","Dreamlike Photoreal V2","Dreamshaper 6 baked vae","Dreamshaper 7","Dreamshaper 8","Edge of Realism EOR V2.0","Eimis Anime Diffusion V1.0","Elldreth's Vivid","EpiCRealism Natural Sin RC1","I Cant Believe Its Not Photography Seco","Juggernaut Aftermath","Lofi V4","Lyriel V1.6","MajicMix Realistic V4","MechaMix V1.0","MeinaMix Meina V9","MeinaMix Meina V11","Neverending Dream V1.22","Openjourney V4","Pastel-Mix","Portrait+ V1","Protogen x3.4","Realistic Vision V1.4","Realistic Vision V2.0","Realistic Vision V4.0","Realistic Vision V5.0","Redshift Diffusion V1.0","ReV Animated V1.2.2","RunDiffusion FX 2.5D V1.0","RunDiffusion FX Photorealistic V1.0","SD V1.4","SD V1.5","SD V1.5 Inpainting","Shonin's Beautiful People V1.0","TheAlly's Mix II","Timeless V1","ToonYou Beta 6"]

def generate_img(prompt : str, negative_prompt : str, model : str, filename : str = 'image') -> str:
    
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    agent = UserAgent().chrome
    options.add_argument(f'user-agent={agent}')
    print('options')
    with webdriver.Chrome(options=options) as driver:
        print('driver')
        driver.get("https://app.prodia.com/")
        # sleep(5)
        print('opening')
        sleep(10)
        # sleep(6)

        print('start')

        # select an option in html select element

        select = Select(driver.find_element(By.CSS_SELECTOR, "select"))
        print('found select')
        # print(select)

        select.select_by_visible_text(model)
        print('selected model')

        # print('selected')

        advanced_settings = driver.find_element(By.CSS_SELECTOR, "#app > div > div > div.generator.trending.mint-card > div.generator-actions > div.generator-actions-search > svg")
        print('advanced_settings')

        # print(advanced_settings)

        advanced_settings.click()

        print('clicked advanced_settings')

        # sleep(1)

        neg_promt = driver.find_element(By.CSS_SELECTOR, "#app > div > div > div.generator.trending.mint-card > div.advanced-settings.open > div.generator-settings > textarea")
        print('neg_promt')
        #print(neg_promt)

        my_neg_keys = 'EasyNegative'

        neg_promt.send_keys(f"18+, r18, nsfw, porn, hentai, loli, lolicon, {my_neg_keys}, {negative_prompt}")
        print('sent neg_promt')

        # select value on input range

        cfg_scale = driver.find_element(By.CSS_SELECTOR, "#app > div > div > div.generator.trending.mint-card > div.advanced-settings.open > div.generator-settings > div > div.c-field.slider-field.generator-settings-cfg > div > div > div > input")
        print('cfg_scale')
        # print(cfg_scale)

        cfg_scale.click()
        print('clicked cfg_scale')
        for i in range(4):
            cfg_scale.send_keys(Keys.ARROW_RIGHT)
            print('arrow right')

        steps = driver.find_element(By.CSS_SELECTOR, '#app > div > div > div.generator.trending.mint-card > div.advanced-settings.open > div.generator-settings > div > div.c-field.slider-field.generator-settings-steps > div > div > div > input')
        print('steps')
        steps.click()
        print('clicked steps')
        for i in range(15):
            steps.send_keys(Keys.ARROW_RIGHT)
            print('arrow right')

        sleep(3)
        # sleep(0.2)

        textarea = driver.find_element(By.ID, "prompt")
        print('textarea')

        textarea.send_keys(prompt)
        print('sent textarea')

        generate = driver.find_element(By.CSS_SELECTOR, generate_btn)
        print('generate')

        generate.click()
        print('clicked generate')

        sleep(15)
        # sleep(12)

        result = driver.find_element(By.CSS_SELECTOR, '.results > .results-item:first-child')
        print('result')

        result.click()
        print('clicked result')

        sleep(5)
        # sleep(2)

        img = driver.find_element(By.CSS_SELECTOR, 'img')
        print('img')

        src = img.get_attribute('src')
        print('src')

        # open src in new tab with selenium

        driver.get(src)
        print('get src')

        img = driver.find_element(By.TAG_NAME, 'img')
        print('img')

        return img.screenshot_as_base64

        # # import pyperclip

        # pyperclip.copy(img.screenshot_as_base64)

        # img.screenshot(f'{filename}.png')

        # return f'{filename}.png'

# async def test():
#     await generate_img('blue hair', '', MODELS[0])
#     await generate_img('red hair', '', MODELS[0])

def test():
    result = []
    for model in MODELS:
        res = f'{model}: '
        try:
            src = generate_img('blue hair', '', model)
            res = f'{res} YES'
        except Exception as e:
            res = f'{res} NO'
        finally:
            result.append(res)
    print('\n'.join(result), '\n', result)

if __name__ == '__main__':
    # test()
    src = generate_img('blue hair', '', 'Dreamlike Anime V1')
    import pyperclip
    pyperclip.copy(src)
    # from asyncio import run
    # run(test())